import { Guild } from '@/pages';
import clsx from 'clsx';
import React from 'react';

interface GuildExplorerProps {
  guilds: Guild[];
  selectedGuilds: string[];
  onGuildSelect: (guildId: string) => void;
}
const GuildExplorer: React.FC<GuildExplorerProps> = ({
  guilds,
  onGuildSelect,
  selectedGuilds,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredGuilds = guilds.filter((guild) =>
    guild.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className='flex max-w-lg items-stretch'>
        <input
          type='text'
          className='block w-full rounded-tl-md rounded-bl-md  border-yellow bg-transparent text-white shadow-sm focus:border-yellow focus:ring-yellow'
          placeholder='Search Discord servers'
        />
        <button className='rounded-tr-md rounded-br-md bg-yellow px-4'>
          <svg
            width={24}
            height={24}
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M14 5l7 7m0 0l-7 7m7-7H3'
              stroke='#120029'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
      </div>
      <div className='mt-8 grid grid-cols-3 gap-4'>
        {filteredGuilds.map((guild) => (
          <div
            className={clsx(
              'relative flex cursor-pointer items-center space-x-4 rounded-lg border-2 p-4 transition-all duration-300',
              selectedGuilds.includes(guild.id) && ' border-yellow text-yellow',
              !selectedGuilds.includes(guild.id) &&
                'border-white/20 hover:bg-white/20'
            )}
            key={guild.id}
            onClick={() => onGuildSelect(guild.id)}
          >
            <img
              className='h-12 w-12 rounded-2xl'
              src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`}
              alt=''
            />
            <span className='block flex-1 truncate'>{guild.name}</span>
            {selectedGuilds.includes(guild.id) && (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={2}
                stroke='currentColor'
                className='h-5 w-5 text-yellow'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M4.5 12.75l6 6 9-13.5'
                />
              </svg>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default GuildExplorer;
