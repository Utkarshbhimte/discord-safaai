import * as React from 'react';

import Layout from '@/components/layout/Layout';
import Seo from '@/components/Seo';
import clx from 'classnames';
import IntroForm from '@/components/IntroForm';
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

      <IntroForm />
    </Layout>
  );
}
