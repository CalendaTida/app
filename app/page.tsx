import App from '@/components/App';
import Landing from '@/components/Landing';
import { getSession } from '@/lib/server';

export default async function Page() {
  const session = await getSession();
  return session ? <App name={session.name} /> : <Landing />;
}
