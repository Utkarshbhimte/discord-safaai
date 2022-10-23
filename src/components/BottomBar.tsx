import GuildLogo from '@/components/GuildLogo';
import { Guild } from '@/pages';
import clsx from 'clsx';
import React from 'react';

interface BottomBarProps {
  selectedGuilds: string[];
  setSelectedGuilds: React.Dispatch<React.SetStateAction<string[]>>;
  guilds: Guild[];
}
const BottomBar: React.FC<BottomBarProps> = ({
  selectedGuilds,
  guilds,
  setSelectedGuilds,
}) => {
  // get the first 5 guilds
  const guildsToDisplay = selectedGuilds.slice(0, 4);

  // get the count of the remaining guilds
  const remainingGuilds = Math.max(
    selectedGuilds.length - guildsToDisplay.length,
    0
  );

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
                    onClick={() =>
                      setSelectedGuilds(
                        selectedGuilds.filter((id) => id !== guildId)
                      )
                    }
                    className='-ml-4 cursor-pointer shadow-2xl'
                  >
                    <GuildLogo
                      key={guildId}
                      guild={guild}
                      className={clsx('rounded-full border-2 border-yellow')}
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
            className='focus:ring-bg-pink/80 inline-flex items-center rounded-md border border-transparent bg-pink px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-pink/80 focus:outline-none focus:ring-2 focus:ring-offset-2'
          >
            Leave selected servers
          </button>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
