import Image from 'next/image';
import logo from '../assets/logo.svg';

export const AppLogo: React.FC = () => {
  return <Image width={42} height={42} src={logo} alt="MeetApp" />;
};
