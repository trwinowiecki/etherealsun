import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { getError } from '../../utils/error';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

export default function LoginPage() {
  const { data: session } = useSession();

  const router = useRouter();
  const { redirect } = router.query;

  const providers = [
    { name: 'Google', logo: 'logo-google' },
    { name: 'Facebook', logo: 'logo-facebook' },
  ];

  useEffect(() => {
    if (session?.user) {
      router.push(redirect || '/');
    }
  }, [router, session, redirect]);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const submitHandler = async ({ email, password }) => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  return (
    <Layout title="Login">
      <form
        className="mx-auto max-w-screen-md"
        onSubmit={handleSubmit(submitHandler)}
      >
        <h1 className="mb-4 text-xl">Login</h1>
        <div className="">
          {providers.map((provider) => (
            <div className="mb-4">
              <button
                key={provider.name}
                className="primary-button w-full flex align-middle "
              >
                <ion-icon name={provider.logo} />
                <span>&nbsp;{provider.name}</span>
              </button>
            </div>
          ))}
        </div>
        <div className="mb-4">
          Don&apos;t have an account? &nbsp;{' '}
          <Link href="register">Register</Link>
        </div>
      </form>
    </Layout>
  );
}
