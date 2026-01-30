import { Stack } from "expo-router";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://bc20539a1928b18d153315e4eae01cd4@o4509929247408128.ingest.us.sentry.io/4510798189690880',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});
import "../global.css"
import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ClerkProvider } from "@clerk/clerk-expo"
import { tokenCache } from '@clerk/clerk-expo/token-cache'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknown",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-mutation-error"
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        }
      })
    }
  })
})

export default Sentry.wrap(function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{
          headerShown: false
        }} />
      </QueryClientProvider>
    </ClerkProvider>
  )
});