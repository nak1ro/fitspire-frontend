import { redirect } from 'next/navigation';

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignInRedirect({ searchParams }: Props) {
    const params = new URLSearchParams();
    params.set('mode', 'login');
    for (const [key, value] of Object.entries(await searchParams)) {
        if (typeof value === 'string') params.set(key, value);
    }
    redirect(`/auth?${params.toString()}`);
}
