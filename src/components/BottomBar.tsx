import GuildLogo from '@/components/GuildLogo';
import SuccessModal from '@/components/SuccessModal';
import { fetchWithToken } from '@/lib/fetchWithToken';
import { Guild } from '@/pages';
import clsx from 'clsx';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface BottomBarProps {
  selectedGuilds: string[];
  setSelectedGuilds: React.Dispatch<React.SetStateAction<string[]>>;
  guilds: Guild[];
  setGuilds: React.Dispatch<React.SetStateAction<Guild[]>>;
}
const BottomBar: React.FC<BottomBarProps> = ({
  selectedGuilds,
  guilds,
  setSelectedGuilds,
  setGuilds,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [deletedNumber, setDeletedNumber] = useState<number>(0);
  // get the first 5 guilds
  const guildsToDisplay = selectedGuilds.slice(0, 4);

  // get the count of the remaining guilds
  const remainingGuilds = Math.max(
    selectedGuilds.length - guildsToDisplay.length,
    0
  );

  const deleteGuild = async (guildId: string) => {
    await fetchWithToken(
      `https://discord.com/api/v9/users/@me/guilds/${guildId}`,
      {
        method: 'DELETE',
      }
    );
    setDeletedNumber(deletedNumber + 1);

    return;
  };

  const deleteAllGuilds = async () => {
    setDeletedNumber(0);
    setLoading(true);

    // filter out the rest of the guilds
    const guildsLeft = guilds.filter(
      (guild) => !selectedGuilds.includes(guild.id)
    );

    await Promise.all(selectedGuilds.map(deleteGuild));

    setGuilds(guildsLeft);
    setDeletedNumber(selectedGuilds.length);

    setLoading(false);
    setSelectedGuilds([]);
  };

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 h-fit w-full translate-y-full transform bg-[#1E0D34] transition-transform duration-300',
        !!selectedGuilds.length && 'translate-y-0'
      )}
    >
      <div className='layout py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex flex-1 items-center'>
            <div className='flex pl-2'>
              {guildsToDisplay.map((guildId) => {
                const guild = guilds.find((g) => g.id === guildId);
                if (!guild) return null;

                return (
                  <div
                    key={guild.id}
                    // onClick={() =>
                    //   setSelectedGuilds(
                    //     selectedGuilds.filter((id) => id !== guildId)
                    //   )
                    // }
                    className='-ml-4 cursor-pointer shadow-2xl'
                  >
                    <GuildLogo
                      key={guildId}
                      guild={guild}
                      className={clsx('rounded-full')}
                    />
                  </div>
                );
              })}
            </div>
            {!!remainingGuilds && (
              <div className='ml-4 text-white/50'>+ {remainingGuilds} more</div>
            )}
          </div>
          <button
            type='button'
            onClick={deleteAllGuilds}
            className='my-1 inline-flex items-center rounded-md border border-transparent bg-pink px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-pink focus:outline-none focus:ring-2 focus:ring-pink focus:ring-offset-2'
          >
            {!loading && <span>Leave selected servers</span>}
            {loading && (
              <span>
                Deleting servers ({deletedNumber}/{selectedGuilds.length})
              </span>
            )}
          </button>

          {loading && (
            <div
              style={{
                width: (deletedNumber / selectedGuilds.length) * 100 + '%',
              }}
              className='absolute top-0 left-0 h-full w-16 animate-pulse bg-white/20 transition duration-300'
            ></div>
          )}
        </div>
      </div>
      <SuccessModal count={deletedNumber} setOpen={() => setDeletedNumber(0)} />
    </div>
  );
};

export default BottomBar;
