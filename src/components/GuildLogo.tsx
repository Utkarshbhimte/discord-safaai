import { Guild } from '@/pages';
import clsx from 'clsx';
import React from 'react';

interface GuildLogoProps {
  guild: Guild;
  className?: string;
}
const GuildLogo: React.FC<GuildLogoProps> = ({ guild, className }) => {
  if (guild.icon)
    return (
      <img
        className={clsx(className, 'h-12 w-12 rounded-2xl')}
        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.jpg`}
        alt=''
      />
    );
  else
    return (
      <div
        className={clsx(
          className,
          'h-12 w-12 rounded-2xl',
          'flex  items-center justify-center text-center text-2xl font-medium transition-all duration-300'
        )}
      >
        {guild.name[0]}
      </div>
    );
};

export default GuildLogo;
