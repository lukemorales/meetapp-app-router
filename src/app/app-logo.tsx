import Image from 'next/image';

import logo from '../assets/logo.svg';

type AppLogoProps = {
  size?: number;
};

export const AppLogo: React.FC<AppLogoProps> = ({ size = 42 }) => (
  <Image width={size} height={size} src={logo} alt="MeetApp" />
);
