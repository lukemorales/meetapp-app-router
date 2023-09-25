import { Body } from '@react-email/body';
import { Container } from '@react-email/container';
import { Head } from '@react-email/head';
import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';

export const EmailLayout: React.FC<React.PropsWithChildren> = ({
  children,
}) => (
  <Html lang="en">
    <Head />

    <Tailwind>
      <Body
        className="bg-[#302033]"
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
      >
        <Container className="mx-auto my-6 max-w-[35.625rem] rounded bg-[#19141E] p-6 text-base text-[#dadada]">
          {children}

          <div className="mt-20 border-t-[1px] border-t-[#372b44] pt-7 text-center text-[#716979]">
            Equipe MeetApp
          </div>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
