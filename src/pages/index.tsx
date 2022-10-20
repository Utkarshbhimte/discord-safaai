import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import clx from 'classnames';
/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

export interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: number;
  features: string[];
  permissions_new: string;
}

export default function HomePage() {
  const [token, setToken] = React.useState();

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [selectedGuilds, setSelectedGuilds] = React.useState<string[]>([]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // get token value
    const input = e.currentTarget.elements.namedItem('token');
    const currToken = (input as any)?.value;

    setToken(currToken);
    fetchGuilds();
  };

  const fetchGuilds = async () => {
    const resp = await fetch(
      'https://canary.discord.com/api/users/@me/guilds',
      { headers: { authorization: token || '' } }
    );
    const json: Guild[] = await resp.json();
    setGuilds(json);
  };

  const handleGuildSelect = (guildId: string) => {
    const newSelectedGuilds = [...selectedGuilds];
    const index = newSelectedGuilds.indexOf(guildId);

    if (index > -1) {
      newSelectedGuilds.splice(index, 1);
    } else {
      newSelectedGuilds.push(guildId);
    }

    setSelectedGuilds(newSelectedGuilds);
  };

  const deleteGuild = async (guildId: string) => {
    return fetch(`https://discord.com/api/v9/users/@me/guilds/${guildId}`, {
      method: 'DELETE',
      headers: { authorization: token || '' },
    });
  };

  const deleteAllGuilds = async () => {
    setLoading(true);
    for (const guildId of selectedGuilds) {
      await deleteGuild(guildId);
    }
    await fetchGuilds();
    setLoading(false);
    setSelectedGuilds([]);
  };

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      <main>
        <section className='bg-white'>
          {!guilds.length && (
            <div className='layout flex min-h-screen max-w-2xl flex-col justify-center text-left'>
              <h1 className='mt-4'>
                Clean your discord easily <span>🧹</span>
              </h1>
              <p className='text-md mt-2 text-gray-800'>
                Don't share you token anywhere. It's a secret.
              </p>

              <div className='mt-6 w-full'>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700'
                >
                  Enter your token here
                </label>
                <form
                  onSubmit={handleSubmit}
                  className='mt-1 flex items-stretch space-x-4'
                >
                  <input
                    type='password'
                    required
                    defaultValue={process.env.NEXT_PUBLIC_DEFAULT_TOKEN || ''}
                    name='token'
                    className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                    placeholder='********************************'
                  />
                  <button
                    type='submit'
                    className='inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Submit
                  </button>
                </form>
              </div>
            </div>
          )}

          {!!guilds.length && (
            <div className='layout grid min-h-screen max-w-4xl grid-cols-3 justify-center gap-4 py-24 text-left'>
              {guilds.map((guild) => (
                <div
                  onClick={() => handleGuildSelect(guild.id)}
                  className={clx(
                    'rounded-lg border border-gray-200 p-4 hover:bg-blue-100',
                    selectedGuilds.includes(guild.id) && 'bg-blue-100'
                  )}
                >
                  {/* <span>{guild.icon}</span> */}
                  <div className='text-lg'>{guild.name}</div>
                </div>
              ))}
            </div>
          )}

          {!!selectedGuilds.length && (
            <div className='fixed bottom-6 left-0 w-screen'>
              <div className='mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white shadow-2xl'>
                <div className='mx-auto my-2 flex max-w-4xl justify-between space-x-2 py-4 px-4'>
                  <div className='text-2xl'>
                    You have selected{' '}
                    <span className='text-blue-500'>
                      {selectedGuilds.length}
                    </span>{' '}
                    servers
                  </div>
                  <button
                    onClick={deleteAllGuilds}
                    className='ml-auto inline-flex items-center rounded-md border border-transparent bg-red-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </Layout>
  );
}
