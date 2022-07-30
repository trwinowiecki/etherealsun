import React from 'react';
import Link from 'next/Link';
import Head from 'next/head';

export default function Layout({ title, children }) {
  return (
    <>
      <Head>
        <title>{title ? title + ' - EtherealSun' : 'EtherealSun'}</title>
        <meta name="description" content="Ethereal Sun Designs Jewelry" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="flex min-h-screen flex-col justify-between">
        <header>
          <nav className="flex h-12 item-center px-4 justify-between shadow-md">
            <Link href="/">
              <a className="text-lg font-bold">EtherealSun</a>
            </Link>
            <div>
              <Link href="/cart">
                <a className="p-2">Cart</a>
              </Link>
              <Link href="/login">
                <a className="p-2">Login</a>
              </Link>
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>
        <footer className="flex justify-center items-center h-10 shadow-inner">
          <p>Copyright &copy; EtherealSunDesigns</p>
        </footer>
      </div>
    </>
  );
}
