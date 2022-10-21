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
  const [token, setToken] = React.useState<string>();

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const [searchTerm, setSearchTerm] = React.useState('');

  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [selectedGuilds, setSelectedGuilds] = React.useState<string[]>([]);
  const [guildDetails, setGuildDetails] =
    React.useState<Record<string, Guild>>();

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // get token value
    const input = e.currentTarget.elements.namedItem('token');
    const currToken = (input as any)?.value;

    setToken(currToken);
    await fetchGuilds();

    // sace the user's token to localstorage
    localStorage?.setItem('token', currToken);
  };

  const fetchGuilds = async () => {
    const resp = await fetch(
      'https://canary.discord.com/api/users/@me/guilds',
      { headers: { authorization: token || '' } }
    );
    const json: Guild[] = await resp.json();
    setGuilds(json);

    // await Promise.all(
    //   Object.values(json).map((guild) => fetchGuildDetails(guild.id))
    // );
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

  // get guild details
  const fetchGuildDetails = async (guildId: string) => {
    if (!guildId) {
      return;
    }

    const cacheKey = `guildDetails-${guildId}`;
    // check local storage first
    const guildDetailsFromLocalStorage: Guild = JSON.parse(
      localStorage.getItem(cacheKey) || '{}'
    );
    console.log(
      '🚀 ~ file: index.tsx ~ line 95 ~ fetchGuildDetails ~ guildDetailsFromLocalStorage',
      guildDetailsFromLocalStorage
    );

    if (guildDetailsFromLocalStorage?.id) {
      const newGuildDetails: Record<string, Guild> = {
        ...(guildDetails || {}),
        [guildId]: guildDetailsFromLocalStorage,
      };

      setGuildDetails(newGuildDetails);
      return;
    }

    try {
      const resp = await fetch(
        `https://canary.discord.com/api/guilds/${guildId}`,
        { headers: { authorization: token || '' } }
      );
      const json = await resp.json();

      // cache to local storage to speed up load time
      localStorage.setItem(cacheKey, JSON.stringify(json));

      return json;
    } catch (error) {
      console.error(error);
    }
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

  const handleSearchChange: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const value = e.currentTarget.value || '';
    setSearchTerm(value);
  };

  const filteredGuilds = React.useMemo(() => {
    if (!searchTerm) {
      return guilds;
    }

    return guilds.filter((guild) => {
      return guild.name.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [guilds, searchTerm]);

  React.useEffect(() => {
    const tokenFromLocalStorage = localStorage?.getItem('token');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      fetchGuilds();
    }
  }, []);

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
            <div className='mx-auto my-12 max-w-4xl'>
              <input
                type='search'
                onChange={handleSearchChange}
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                placeholder='Search discord guilds'
              />
            </div>
          )}

          {!!filteredGuilds.length && (
            <>
              <div className='layout my-12 grid max-w-4xl grid-cols-3 justify-center gap-4 text-left'>
                {filteredGuilds.map((guild) => (
                  <div
                    key={guild.id}
                    onClick={() => handleGuildSelect(guild.id)}
                    // onClick={() => checkMutualFriends(guild.id)}
                    className={clx(
                      'item-center flex cursor-pointer items-center space-x-4 rounded-lg border border-gray-200 p-4 transition-all duration-300 hover:bg-blue-100',
                      selectedGuilds.includes(guild.id) &&
                        'border-blue-100 bg-blue-100'
                    )}
                  >
                    {guild.icon && (
                      <img
                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`}
                        className='h-12 w-12 rounded-full'
                      />
                    )}

                    {/* show the first letter of the name as avatar */}
                    {!guild.icon && (
                      <div className='inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700'>
                        {guild.name.substring(0, 1).toUpperCase()}
                      </div>
                    )}

                    <div className='text-lg'>{guild.name}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {!!selectedGuilds.length && (
            <div className='fixed bottom-6 left-0 w-screen'>
              <div className='mx-auto max-w-6xl rounded-2xl border border-gray-200 bg-white shadow-2xl'>
                <div className='mx-auto my-2 flex max-w-4xl justify-between space-x-2 py-4 px-0'>
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
