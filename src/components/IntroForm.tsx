import { fetchWithToken } from '@/lib/fetchWithToken';
import { getUserInfo, User } from '@/pages';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

interface IntroFormProps {
  onSubmit: (user: User) => Promise<void>;
}
const IntroForm: React.FC<IntroFormProps> = ({ onSubmit }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem('token');
    const token = (input as any)?.value;

    try {
      setLoading(true);
      // get user data from discord
      const json = await getUserInfo();

      // save the token
      localStorage?.setItem('token', token);

      await onSubmit(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className='layout relative grid min-h-screen flex-1 items-center justify-between py-2 md:grid-cols-3'>
      <div className='col-span-2'>
        <h1 className='mb-8 text-4xl font-semibold md:text-8xl'>
          Clean <br />
          the irrelevant{' '}
          <span className='italic text-yellow'>Discord Servers</span>
        </h1>

        <div className='my-4 max-w-lg rounded-xl border border-pink p-3 text-sm'>
          <strong>
            Warning: be careful, sharing your user token can be dangerous!
          </strong>{' '}
          <br />
          This page does not use your user token in any harmful way and only
          uses it to authenticate with Discord, fetch your serves and help you
          leave them, something that is not supported by the official API.
          <a
            href='https://githubbox.com/Utkarshbhimte/discord-safaai'
            target={'_blank'}
            rel='noreferrer'
            className='mt-2 block underline'
          >
            Click here to check the code and deploy your own version.
          </a>{' '}
        </div>

        <form onSubmit={handleSubmit} className='flex max-w-lg items-stretch'>
          <input
            className='block w-full rounded-tl-md rounded-bl-md  border-yellow bg-transparent text-white shadow-sm focus:border-yellow focus:ring-yellow'
            defaultValue={process.env.NEXT_PUBLIC_DEFAULT_TOKEN || ''}
            placeholder='Enter your token here'
            type='password'
            name='token'
          />
          <button className='rounded-tr-md rounded-br-md bg-yellow px-4'>
            {loading && (
              <svg
                className='ml-1 h-5 w-5 animate-spin text-black'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                width={24}
                height={24}
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                ></circle>
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8v1a7 7 0 00-7 7h1z'
                ></path>
              </svg>
            )}

            {!loading && (
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
            )}
          </button>
        </form>
        <a
          target={'_blank'}
          href='https://www.youtube.com/watch?v=bxCforAZD7k&ab_channel=Exordium'
          rel='noreferrer'
          className='mt-3 flex cursor-pointer items-center space-x-2 text-sm'
        >
          <svg
            width={14}
            height={14}
            viewBox='0 0 14 14'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M7 .333c3.674 0 6.666 2.991 6.666 6.67 0 3.673-2.992 6.664-6.666 6.664-3.675 0-6.667-2.991-6.667-6.663C.333 3.324 3.325.334 7 .334zm-.76 4.02a.895.895 0 00-.405.097.834.834 0 00-.36.399 4.3 4.3 0 00-.116.47c-.071.379-.11.996-.11 1.678 0 .65.039 1.241.097 1.627.006.007.077.437.154.585a.81.81 0 00.715.438h.025c.193-.007.599-.174.599-.18.682-.283 2.027-1.165 2.567-1.75l.039-.038c.07-.071.16-.18.18-.206a.812.812 0 00-.013-.971c-.025-.026-.122-.135-.212-.226-.528-.566-1.905-1.492-2.626-1.775-.109-.044-.386-.141-.534-.148z'
              fill='#E2E2EA'
            />
          </svg>
          <span className='underline'>
            Watch tutorial to learn how to get the token
          </span>
        </a>

        <div className='absolute bottom-2 flex items-center space-x-4 md:bottom-8'></div>
      </div>

      <div className='fixed bottom-0 left-0 h-1 w-full bg-yellow'>
        <PoweredBySpan />
      </div>
    </div>
  );
};

export default IntroForm;

export const PoweredBySpan = () => {
  return (
    <>
      <span className='font-medium italic'>Powered By</span>
      <svg
        width={171}
        height={41}
        viewBox='0 0 171 41'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d='M53.293 26.179h5.48c2.794 0 4.405-1.352 4.405-3.666 0-1.573-.722-2.647-2.147-3.11 1.277-.536 1.943-1.61 1.943-3.11 0-2.258-1.629-3.646-4.294-3.646h-5.387v13.532zm5.183-11.44c1.333 0 2.073.629 2.073 1.795 0 1.204-.722 1.888-2.017 1.888h-2.87V14.74h2.814zm.204 5.683c1.314 0 2.073.648 2.073 1.795 0 1.222-.74 1.87-2.073 1.87h-3.018v-3.665h3.018zM71.219 17.034v4.794c0 1.74-.685 2.573-2.11 2.573-1.26 0-1.944-.703-1.944-2.443v-4.924h-2.259v5.72c0 2.24 1.24 3.665 3.35 3.665 1.223 0 2.407-.592 2.963-1.462l.166 1.222h2.092v-9.145h-2.258zM76.939 15.201c.74 0 1.351-.61 1.351-1.37 0-.758-.61-1.35-1.351-1.35-.778 0-1.389.592-1.389 1.35 0 .76.611 1.37 1.389 1.37zm-1.13 10.978h2.259v-9.145H75.81v9.145zM82.678 26.179V12.406h-2.24V26.18h2.24zM88.805 26.42c1.388 0 2.573-.612 3.128-1.667l.148 1.426h2.074V12.406h-2.24V18.2c-.574-.907-1.703-1.444-2.98-1.444-2.759 0-4.425 2.037-4.425 4.887 0 2.833 1.648 4.776 4.295 4.776zm.5-2.074c-1.574 0-2.536-1.148-2.536-2.777 0-1.629.962-2.795 2.536-2.795 1.573 0 2.591 1.148 2.591 2.795 0 1.648-1.018 2.777-2.591 2.777zM109.188 19.404c0-4.129-2.702-6.998-6.571-6.998-3.869 0-6.553 2.888-6.553 6.998 0 4.128 2.666 6.997 6.534 6.997 3.888 0 6.59-2.888 6.59-6.997zm-2.499 0c0 2.85-1.592 4.72-4.072 4.72-2.481 0-4.073-1.833-4.073-4.72 0-2.888 1.592-4.72 4.073-4.72 2.48 0 4.072 1.832 4.072 4.72zM113.319 26.179v-4.924c0-1.481.851-2.444 2.24-2.444 1.166 0 1.925.74 1.925 2.277v5.09h2.258v-5.627c0-2.37-1.184-3.795-3.48-3.795-1.24 0-2.351.537-2.925 1.463l-.185-1.185h-2.092v9.145h2.259zM128.014 26.4c3.203 0 5.683-1.887 6.202-4.738h-2.462c-.445 1.5-1.852 2.462-3.684 2.462-2.481 0-4.073-1.851-4.073-4.72 0-2.888 1.574-4.702 4.073-4.702 1.795 0 3.147.925 3.61 2.499h2.499c-.463-2.907-2.851-4.776-6.054-4.776-3.961 0-6.608 2.795-6.608 6.997 0 4.24 2.554 6.979 6.497 6.979zM138.175 26.179V21.18c0-1.37.833-2.37 2.259-2.37 1.147 0 1.906.74 1.906 2.277v5.09h2.259v-5.627c0-2.37-1.185-3.795-3.443-3.795-1.315 0-2.388.574-2.962 1.463v-5.813h-2.277V26.18h2.258zM149.539 26.42c1.425 0 2.665-.649 3.054-1.593l.167 1.352h1.98v-5.554c0-2.536-1.518-3.869-3.98-3.869-2.48 0-4.109 1.296-4.109 3.277h1.925c0-.963.741-1.518 2.073-1.518 1.148 0 1.889.5 1.889 1.74v.204l-2.74.203c-2.166.167-3.388 1.222-3.388 2.907 0 1.721 1.185 2.85 3.129 2.85zm.74-1.704c-1.018 0-1.573-.407-1.573-1.24 0-.74.537-1.203 1.943-1.333l1.907-.148v.481c0 1.407-.888 2.24-2.277 2.24zM158.088 15.201c.741 0 1.351-.61 1.351-1.37 0-.758-.61-1.35-1.351-1.35-.777 0-1.388.592-1.388 1.35 0 .76.611 1.37 1.388 1.37zm-1.129 10.978h2.258v-9.145h-2.258v9.145zM163.809 26.179v-4.924c0-1.481.852-2.444 2.24-2.444 1.166 0 1.925.74 1.925 2.277v5.09h2.258v-5.627c0-2.37-1.184-3.795-3.48-3.795-1.24 0-2.351.537-2.924 1.463l-.186-1.185h-2.091v9.145h2.258z'
          fill='#fff'
        />
        <path
          d='M18.458.8a3.343 3.343 0 014.339 0l1.828 1.558a3.343 3.343 0 002.615.77l2.38-.32a3.349 3.349 0 013.649 2.35l.698 2.303c.276.91.925 1.66 1.785 2.064l2.173 1.02a3.36 3.36 0 011.803 3.956l-.655 2.315a3.363 3.363 0 00.388 2.704l1.279 2.036a3.363 3.363 0 01-.618 4.305l-1.799 1.592a3.36 3.36 0 00-1.132 2.485l-.023 2.406a3.354 3.354 0 01-2.84 3.287l-2.373.364a3.348 3.348 0 00-2.293 1.477l-1.316 2.012a3.345 3.345 0 01-4.163 1.225l-2.193-.979a3.341 3.341 0 00-2.725 0l-2.193.98c-1.5.669-3.262.15-4.163-1.226l-1.316-2.012A3.348 3.348 0 009.3 35.995l-2.373-.364a3.354 3.354 0 01-2.84-3.287l-.023-2.406a3.36 3.36 0 00-1.132-2.485l-1.8-1.592a3.363 3.363 0 01-.617-4.305l1.279-2.036a3.363 3.363 0 00.388-2.704L1.527 14.5a3.36 3.36 0 011.802-3.956l2.174-1.02a3.355 3.355 0 001.785-2.064l.698-2.302a3.349 3.349 0 013.65-2.352l2.379.32a3.344 3.344 0 002.614-.769L18.458.799z'
          fill='url(#paint0_linear_45_1510)'
        />
        <path
          fillRule='evenodd'
          clipRule='evenodd'
          d='M29.4 10.46c-2.884.234-5.763 1.365-8.244 3.237-.572.432-.916.734-1.593 1.4l-.597.587-.478.024c-2.365.119-4.906 1.228-6.643 2.898-.329.317-.347.342-.347.502 0 .128.027.2.11.292l.11.123 1.703.247 1.703.247-.236.266c-.268.302-.318.443-.226.637.084.178 5.545 5.632 5.695 5.688.181.068.323.012.612-.24l.267-.234.239 1.664c.17 1.185.259 1.693.307 1.767.095.145.31.21.49.151.245-.081.959-.91 1.542-1.793.997-1.509 1.641-3.432 1.728-5.159l.024-.478.588-.597c.885-.902 1.375-1.5 2.025-2.477 1.646-2.474 2.636-5.498 2.635-8.053 0-.43-.07-.613-.261-.686-.094-.036-.775-.043-1.153-.012zm-3.99 3.738a2.125 2.125 0 011.642 1.643c.031.149.057.342.057.43 0 .752-.497 1.558-1.162 1.884-.284.139-.704.246-.967.246-.75 0-1.56-.5-1.884-1.163-.139-.284-.246-.704-.246-.967 0-.528.245-1.103.636-1.494a2.06 2.06 0 011.923-.58zm-11.182 9.866a2.742 2.742 0 00-1.356.615c-.537.44-1.188 1.843-2.036 4.388-.454 1.36-.469 1.448-.282 1.634.187.187.275.172 1.625-.278 2.549-.85 3.954-1.503 4.395-2.041.887-1.083.85-2.543-.09-3.534a2.628 2.628 0 00-1.545-.787c-.313-.046-.382-.046-.711.003z'
          fill='url(#paint1_linear_45_1510)'
        />
        <defs>
          <linearGradient
            id='paint0_linear_45_1510'
            x1={41.2547}
            y1={-4.71118}
            x2={7.25776}
            y2={43.9286}
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='#1649FF' />
            <stop offset={1} stopColor='#0A1022' stopOpacity={0.63} />
          </linearGradient>
          <linearGradient
            id='paint1_linear_45_1510'
            x1={20.6277}
            y1={10.4414}
            x2={20.6277}
            y2={30.8141}
            gradientUnits='userSpaceOnUse'
          >
            <stop stopColor='#fff' />
            <stop offset={1} stopColor='#fff' stopOpacity={0.28} />
          </linearGradient>
        </defs>
      </svg>
    </>
  );
};
