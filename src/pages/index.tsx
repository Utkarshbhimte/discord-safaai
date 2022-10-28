import * as React from 'react';

import BottomBar from '@/components/BottomBar';
import GuildExplorer from '@/components/GuildExplorer';
import IntroForm from '@/components/IntroForm';
import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import toast from 'react-hot-toast';
import { fetchWithToken } from '@/lib/fetchWithToken';
import SuccessModal from '@/components/SuccessModal';
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

export const getUserInfo = async () => {
  const resp = await fetchWithToken('https://canary.discord.com/api/users/@me');
  const json: User & { message?: string } = await resp.json();
  return json;
};

export default function HomePage() {
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
    try {
      const resp = await fetch(
        'https://canary.discord.com/api/users/@me/guilds',
        { headers: { authorization: token } }
      );
      const json: Guild[] & { message?: string } = await resp.json();

      if (json.message) {
        if (resp.status === 429) {
          // wait for 1 second
          setTimeout(() => {
            fetchGuilds();
          }, 1000);
          return;
        }
        throw new Error(json.message);
      }

      setGuilds(json);
    } catch (error) {
      toast.error((error as any).message);
      console.error(error);
    }
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

  React.useEffect(() => {
    const tokenFromLocalStorage = localStorage?.getItem('token');
    if (tokenFromLocalStorage) {
      fetchGuilds();
      getUserInfo().then((user) => {
        setUserData(user);
      });
    }
  }, []);

  return (
    <Layout>
      <Seo />

      {!userData && <IntroForm onSubmit={handleSubmit} />}

      {!!userData && (
        <>
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
              setSelectedGuilds={setSelectedGuilds}
              onGuildSelect={handleGuildSelect}
              selectedGuilds={selectedGuilds}
            />
          </div>
          <BottomBar
            guilds={guilds}
            selectedGuilds={selectedGuilds}
            setSelectedGuilds={setSelectedGuilds}
            setGuilds={setGuilds}
          />
        </>
      )}
    </Layout>
  );
}
