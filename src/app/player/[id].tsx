import { Ionicons } from '@expo/vector-icons';
import NetInfo, { useNetInfo } from '@react-native-community/netinfo';
import * as WebBrowser from 'expo-web-browser';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StatusBar, Text, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';
import { useCourseStore } from '../../store/useCourseStore';
import { HapticService } from '../../utils/haptics';
import { NotificationService } from '../../utils/notifications';
import { OfflineResourceService } from '../../utils/offlineResources';

type LessonMessage =
    | { type: 'ready' }
    | { type: 'progress'; percent: number }
    | { type: 'complete' };

const clampProgress = (percent: number) => Math.max(0, Math.min(100, Math.round(percent)));

const parseLessonMessage = (rawData: string): LessonMessage | null => {
    try {
        const payload = JSON.parse(rawData) as Partial<LessonMessage>;

        if (payload.type === 'ready') {
            return { type: 'ready' };
        }

        if (payload.type === 'complete') {
            return { type: 'complete' };
        }

        if (payload.type === 'progress' && typeof payload.percent === 'number' && Number.isFinite(payload.percent)) {
            return { type: 'progress', percent: clampProgress(payload.percent) };
        }
    } catch {
        return null;
    }

    return null;
};

const createLessonHtml = () => `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root { color-scheme: light; }
        * { box-sizing: border-box; }
        body {
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
            background: #f8fafc;
            color: #111827;
            line-height: 1.55;
        }
        main { padding: 24px; }
        .eyebrow { color: #2563eb; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; }
        h1 { font-size: 28px; line-height: 1.15; margin: 8px 0 12px; }
        p { color: #4b5563; }
        .panel {
            background: #ffffff;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 18px;
            margin-top: 18px;
        }
        .progress-track { height: 12px; background: #e5e7eb; border-radius: 999px; overflow: hidden; margin: 16px 0; }
        .progress-bar { height: 100%; width: 0%; background: #2563eb; border-radius: 999px; transition: width 180ms ease; }
        .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        button {
            appearance: none;
            border: 0;
            border-radius: 12px;
            background: #2563eb;
            color: #ffffff;
            padding: 12px;
            font-size: 15px;
            font-weight: 800;
        }
        button.secondary { background: #111827; }
        .meta { font-size: 13px; color: #64748b; margin-top: 6px; }
    </style>
</head>
<body>
    <main>
        <div class="eyebrow" id="category">Lesson</div>
        <h1 id="title">Loading lesson...</h1>
        <p id="description">Native course metadata will appear here after injection.</p>

        <section class="panel">
            <strong id="status">Progress: 0%</strong>
            <div class="progress-track"><div class="progress-bar" id="bar"></div></div>
            <p class="meta" id="instructor">Instructor metadata pending.</p>
            <div class="grid">
                <button onclick="sendProgress(25)">25%</button>
                <button onclick="sendProgress(50)">50%</button>
                <button onclick="sendProgress(75)">75%</button>
                <button class="secondary" onclick="completeLesson()">Complete</button>
            </div>
        </section>
    </main>

    <script>
        function post(payload) {
            window.ReactNativeWebView.postMessage(JSON.stringify(payload));
        }

        function renderProgress(percent) {
            var safePercent = Math.max(0, Math.min(100, Math.round(percent || 0)));
            document.getElementById('status').innerText = 'Progress: ' + safePercent + '%';
            document.getElementById('bar').style.width = safePercent + '%';
        }

        window.__LMS_NATIVE_UPDATE__ = function(metadata) {
            document.getElementById('category').innerText = metadata.category || 'Lesson';
            document.getElementById('title').innerText = metadata.title || 'Untitled lesson';
            document.getElementById('description').innerText = metadata.description || '';
            document.getElementById('instructor').innerText = 'Instructor track: ' + (metadata.brand || 'General');
            renderProgress(metadata.progress || 0);
        };

        function sendProgress(percent) {
            renderProgress(percent);
            post({ type: 'progress', percent: percent });
        }

        function completeLesson() {
            renderProgress(100);
            post({ type: 'complete' });
        }

        post({ type: 'ready' });
    </script>
</body>
</html>
`;

export default function CoursePlayerScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const netInfo = useNetInfo();
    const { courses, progress, updateProgress } = useCourseStore();
    const [loading, setLoading] = useState(true);
    const [webError, setWebError] = useState<string | null>(null);
    const [retryKey, setRetryKey] = useState(0);
    const [offlineSaved, setOfflineSaved] = useState(false);
    const webViewRef = useRef<WebView>(null);

    const productId = Number(Array.isArray(id) ? id[0] : id);
    const course = courses.find((candidate) => candidate.id === productId);
    const currentProgress = progress[productId] || 0;
    const isOffline = netInfo.isConnected === false;
    const htmlContent = useMemo(() => createLessonHtml(), []);

    const metadataScript = useMemo(() => {
        if (!course) {
            return 'true;';
        }

        const metadata = {
            id: course.id,
            title: course.title,
            category: course.category,
            description: course.description,
            brand: course.brand,
            progress: currentProgress,
        };

        return `
            window.__LMS_NATIVE_UPDATE__ && window.__LMS_NATIVE_UPDATE__(${JSON.stringify(metadata)});
            true;
        `;
    }, [course, currentProgress]);

    const injectMetadata = () => {
        webViewRef.current?.injectJavaScript(metadataScript);
    };

    const handleProgress = async (percent: number) => {
        updateProgress(productId, percent);

        if (percent === 100) {
            HapticService.success();
            await NotificationService.sendLocalNotification(
                'Lesson completed',
                `Great job finishing ${course?.title || 'this lesson'}.`,
                { courseId: productId, type: 'lesson-complete' }
            );
            Alert.alert('Lesson completed', 'Great job! Your progress has been updated.');
            return;
        }

        HapticService.medium();
    };

    const onMessage = (event: WebViewMessageEvent) => {
        const message = parseLessonMessage(event.nativeEvent.data);

        if (!message) {
            HapticService.warning();
            return;
        }

        if (message.type === 'ready') {
            injectMetadata();
            return;
        }

        if (message.type === 'complete') {
            handleProgress(100);
            return;
        }

        handleProgress(message.percent);
    };

    const retryPlayer = () => {
        setWebError(null);
        setLoading(true);
        setRetryKey((key) => key + 1);
        HapticService.light();
    };

    const saveOfflineResource = async () => {
        if (!course) return;

        await OfflineResourceService.saveCourseResource(course);
        setOfflineSaved(true);
        HapticService.success();
        Alert.alert('Saved for offline planning', 'Lesson metadata is available for offline review.');
    };

    const shouldStartLoad = (request: WebViewNavigation) => {
        const url = request.url || '';
        const isLocalContent = url === 'about:blank' || url.startsWith('data:text/html') || url.startsWith('file://');

        if (isLocalContent) {
            return true;
        }

        WebBrowser.openBrowserAsync(url);
        return false;
    };

    React.useEffect(() => {
        if (!course) return;

        OfflineResourceService.hasResource(course.id).then(setOfflineSaved);
    }, [course]);

    React.useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            if (state.isConnected !== false) {
                return;
            }

            HapticService.warning();
        });

        return () => unsubscribe();
    }, []);

    if (!course) {
        return (
            <SafeAreaView className="flex-1 bg-white items-center justify-center">
                <Text className="text-gray-500 font-medium">Course not found</Text>
                <Pressable onPress={() => router.back()} className="mt-4 bg-blue-600 px-6 py-2 rounded-xl">
                    <Text className="text-white font-bold">Go Back</Text>
                </Pressable>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-black">
            <StatusBar barStyle="light-content" />
            <View style={{ height: insets.top, backgroundColor: '#111827' }} />

            <View className="flex-row items-center px-4 py-3 bg-gray-900 border-b border-gray-800">
                <Pressable onPress={() => router.back()} className="p-2">
                    <Ionicons name="chevron-back" size={24} color="white" />
                </Pressable>
                <View className="flex-1 ml-2">
                    <Text className="text-white font-bold text-lg" numberOfLines={1}>
                        {course.title}
                    </Text>
                    <Text className="text-gray-400 text-xs uppercase tracking-widest">
                        {isOffline ? 'Offline mode' : 'WebView lesson'}
                    </Text>
                </View>
                <Pressable onPress={saveOfflineResource} className="p-2">
                    <Ionicons name={offlineSaved ? 'cloud-done' : 'cloud-download-outline'} size={22} color="#93C5FD" />
                </Pressable>
                <Pressable onPress={injectMetadata} className="p-2">
                    <Ionicons name="sync" size={20} color="#FBBF24" />
                </Pressable>
            </View>

            {isOffline && (
                <View className="bg-amber-500 px-4 py-2">
                    <Text className="text-white text-center font-bold">
                        You are offline. Local lesson content and saved progress still work.
                    </Text>
                </View>
            )}

            <View className="flex-1 bg-white">
                {webError ? (
                    <View className="flex-1 items-center justify-center p-6 bg-white">
                        <Ionicons name="alert-circle-outline" size={56} color="#EF4444" />
                        <Text className="text-xl font-bold text-gray-900 mt-4">Content load error</Text>
                        <Text className="text-gray-500 text-center mt-2 mb-6">{webError}</Text>
                        <Pressable onPress={retryPlayer} className="bg-blue-600 px-6 py-3 rounded-2xl">
                            <Text className="text-white font-bold">Retry Lesson</Text>
                        </Pressable>
                    </View>
                ) : (
                    <WebView
                        key={retryKey}
                        ref={webViewRef}
                        source={{
                            html: htmlContent,
                            headers: {
                                'X-Course-Id': String(course.id),
                                'X-Course-Title': course.title,
                                'X-LMS-Source': 'react-native-lms',
                            },
                        } as any}
                        originWhitelist={['about:blank']}
                        injectedJavaScript={metadataScript}
                        onMessage={onMessage}
                        onShouldStartLoadWithRequest={shouldStartLoad}
                        onLoadEnd={() => {
                            setLoading(false);
                            injectMetadata();
                        }}
                        onError={(event) => {
                            setLoading(false);
                            setWebError(event.nativeEvent.description || 'Unable to load lesson content.');
                        }}
                        onHttpError={(event) => {
                            setLoading(false);
                            setWebError(`Lesson request failed with HTTP ${event.nativeEvent.statusCode}.`);
                        }}
                        className="flex-1"
                    />
                )}

                {loading && !webError && (
                    <View className="absolute inset-0 items-center justify-center bg-white">
                        <ActivityIndicator size="large" color="#3B82F6" />
                    </View>
                )}
            </View>

            <View
                className="px-6 pt-6 bg-gray-900 flex-row justify-between items-center border-t border-gray-800"
                style={{ paddingBottom: Math.max(insets.bottom, 24) }}
            >
                <Pressable
                    onPress={() => handleProgress(Math.max(0, currentProgress - 25))}
                    className="bg-gray-800 p-4 rounded-2xl"
                >
                    <Ionicons name="play-skip-back" size={20} color="white" />
                </Pressable>

                <View className="items-center">
                    <Text className="text-white font-bold">
                        {currentProgress === 100 ? 'Lesson completed' : `${currentProgress}% complete`}
                    </Text>
                    <Text className="text-gray-400 text-xs mt-1">Native controls and WebView bridge</Text>
                </View>

                {currentProgress === 100 ? (
                    <View className="bg-green-600 p-4 rounded-2xl">
                        <Ionicons name="checkmark-done" size={20} color="white" />
                    </View>
                ) : (
                    <Pressable
                        onPress={() => handleProgress(Math.min(100, currentProgress + 25))}
                        className="bg-blue-600 p-4 rounded-2xl shadow-lg shadow-blue-500/50"
                    >
                        <Ionicons name="play-skip-forward" size={20} color="white" />
                    </Pressable>
                )}
            </View>
        </View>
    );
}
