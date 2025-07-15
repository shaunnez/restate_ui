import { useEffect } from "react";
import { AuthPage, ThemedTitleV2 } from "@refinedev/mui";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { authProvider } from "src/authProvider";

import { AppIcon } from "src/components/app-icon";
export default function Login() {
  useEffect(() => {
    if (window.location.hash.indexOf("access_token") > -1) {
      window.location.href =
        "/update-password?token=" +
        window.location.hash.replace("#access_token=", "");
    }
  }, []);
  return (
    <AuthPage
      type="login"
      registerLink={false}
      title={
        <ThemedTitleV2
          collapsed={false}
          text="Restoration Specialists"
          icon={<AppIcon />}
        />
      }
    />
  );
}

Login.noLayout = true;

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (authenticated) {
    return {
      props: {},
      redirect: {
        destination: `/`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...translateProps,
    },
  };
};
