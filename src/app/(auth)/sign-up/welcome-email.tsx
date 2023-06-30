import { EmailLayout } from '@/app/email-layout';
import { Heading } from '@react-email/heading';
import { Text } from '@react-email/text';

type WelcomeEmailProps = {
  name: string;
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ name }) => (
  <EmailLayout>
    <Heading className="text-[18px] font-normal">{`Hey, ${name}`}</Heading>

    <Text>Welcome to Meetapp, the place to manage all your meetups!</Text>
  </EmailLayout>
);
