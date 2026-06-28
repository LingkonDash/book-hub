// app/loading.js  ← Next.js picks this up automatically for every route
import LoadingScreen from '@/components/shared/LoadingScreen';

export default function MainLoadingPage() {
  return <LoadingScreen />;
}