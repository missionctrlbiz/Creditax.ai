import PocketBase from 'pocketbase';
import { pocketbaseUrl } from '@/lib/pb-features';

/**
 * Server-safe PocketBase client factory.
 *
 * `@/lib/pocketbase` is a `'use client'` module — importing getPb() from
 * server code breaks with "Attempted to call ... from the server" the moment
 * PocketBase is enabled (the vector-store hit this first, P18 diff). Server
 * modules must construct their own client from pocketbaseUrl() instead.
 */
export function pbServer(): PocketBase {
  return new PocketBase(pocketbaseUrl());
}
