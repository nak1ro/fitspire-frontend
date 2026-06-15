import { redirect } from 'next/navigation';

interface Props {
    searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function SignUpRedirect({ searchParams }: Props) {
    const params = new URLSearchParams();
    params.set('mode', 'signup');
    for (const [key, value] of Object.entries(await searchParams)) {
        if (typeof value === 'string') params.set(key, value);
    }
    redirect(`/auth?${params.toString()}`);
}
