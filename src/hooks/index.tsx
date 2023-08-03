'use client';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

export function useSetSearchParams() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams?.toString());

  function setSearchParams(key: string, value: string) {
    params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return setSearchParams;
}
