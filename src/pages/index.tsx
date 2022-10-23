import * as React from 'react';

import IntroForm from '@/components/IntroForm';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import { fetchWithToken } from '@/lib/fetchWithToken';
import GuildExplorer from '@/components/GuildExplorer';
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

export interface User {
  id: string;
  username: string;
  avatar: string;
  avatar_decoration: any;
  discriminator: string;
  public_flags: number;
  flags: number;
  purchased_flags: number;
  premium_usage_flags: number;
  banner: any;
  banner_color: any;
  accent_color: any;
  bio: string;
  locale: string;
  nsfw_allowed: boolean;
  mfa_enabled: boolean;
  premium_type: number;
  email: string;
  verified: boolean;
  phone: string;
}

export default function HomePage() {
  // const [token, setToken] = React.useState<string>();

  const [loading, setLoading] = React.useState(false);

  const [searchTerm, setSearchTerm] = React.useState('');

  const [guilds, setGuilds] = React.useState<Guild[]>([]);
  const [selectedGuilds, setSelectedGuilds] = React.useState<string[]>([]);

  const [userData, setUserData] = React.useState<User>();

  const handleSubmit = async (currUser: User) => {
    setUserData(currUser);
    return await fetchGuilds();
  };

  const fetchGuilds = async () => {
    // fetch token from localstorage
    const token = localStorage?.getItem('token');

    if (!token) {
      throw new Error('No token found');
    }

    const resp = await fetch(
      'https://canary.discord.com/api/users/@me/guilds',
      { headers: { authorization: token } }
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
    return fetchWithToken(
      `https://discord.com/api/v9/users/@me/guilds/${guildId}`,
      {
        method: 'DELETE',
      }
    );
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
      fetchGuilds();
    }
  }, []);

  return (
    <Layout>
      {/* <Seo templateTitle='Home' /> */}
      <Seo />

      {!userData && <IntroForm onSubmit={handleSubmit} />}

      {!!userData && (
        <div className='layout pt-24'>
          <div className='py-6'>
            <h1 className='mb-2 text-4xl font-semibold'>
              Hey <span className='text-yellow'>#{userData.username}</span>
            </h1>
            <p className='text-lg text-gray-400'>
              Select and delete the servers which you no longer require
            </p>
          </div>
          <GuildExplorer
            guilds={guilds}
            onGuildSelect={handleGuildSelect}
            selectedGuilds={selectedGuilds}
          />
        </div>
      )}
    </Layout>
  );
}
