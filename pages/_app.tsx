import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import {
  notificationProvider,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
} from "@refinedev/mui";
import routerProvider, {
  UnsavedChangesNotifier,
} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";

import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import { CssBaseline, GlobalStyles, Icon } from "@mui/material";
import { dataProvider } from "@refinedev/supabase";
import { appWithTranslation, useTranslation } from "next-i18next";
import { authProvider } from "src/authProvider";
import { AppIcon } from "src/components/app-icon";
import { supabaseClient } from "src/utility";

import HouseIcon from "@mui/icons-material/House";
import PersonIcon from "@mui/icons-material/Person";
import PeopleIcon from "@mui/icons-material/People";
import AssetsIcon from "@mui/icons-material/Hardware";
import AssetInstanceIcon from "@mui/icons-material/AcUnit";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import ServiceIcon from "@mui/icons-material/DesignServices";
import AssetServiceIcon from "@mui/icons-material/DeviceHub";

import "./_main.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Header={() => <Header sticky={true} />}
        Title={({ collapsed }) => (
          <ThemedTitleV2
            collapsed={collapsed}
            text="Restoration Specialists"
            icon={<AppIcon />}
          />
        )}
      >
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <Component {...pageProps} />
        </LocalizationProvider>
      </ThemedLayoutV2>
    );
  };

  const { t, i18n } = useTranslation();

  const i18nProvider = {
    translate: (key: string, params: object) => t(key, params),
    changeLocale: (lang: string) => i18n.changeLanguage(lang),
    getLocale: () => i18n.language,
  };

  return (
    <>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <Refine
              routerProvider={routerProvider}
              dataProvider={dataProvider(supabaseClient)}
              authProvider={authProvider}
              notificationProvider={notificationProvider}
              i18nProvider={i18nProvider}
              resources={[
                {
                  name: "dashboard",
                  list: "/dashboard",
                  icon: <DashboardIcon />,
                  meta: {
                    canDelete: false,
                  },
                },

                {
                  name: "customers",
                  list: "/customers",
                  create: "/customers/create",
                  edit: "/customers/edit/:id",
                  icon: <PersonIcon />,
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: "suppliers",
                  list: "/suppliers",
                  create: "/suppliers/create",
                  edit: "/suppliers/edit/:id",
                  icon: <PeopleIcon />,
                  meta: {
                    canDelete: false,
                  },
                },

                // {
                //   name: "Asset Groups",
                //   list: "/asset_groups",
                //   create: "/asset_groups/create",
                //   edit: "/asset_groups/edit/:id",
                //   icon: <AssetsIcon />,
                //   meta: {
                //     canDelete: false,
                //     hide: true,
                //   },
                // },
                {
                  name: "Assets",
                  list: "/assets",
                  create: "/assets/create",
                  edit: "/assets/edit/:id",
                  icon: <AssetInstanceIcon />,
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: "sites",
                  list: "/sites",
                  edit: "/sites/edit/:id",
                  icon: <HouseIcon />,
                  meta: {
                    canDelete: false,
                  },
                },
                // {
                //   name: "Site Assets",
                //   list: "/site_assets",
                //   create: "/site_assets/create",
                //   edit: "/site_assets/edit/:id",
                //   icon: <AssetServiceIcon />,
                //   meta: {
                //     canDelete: false,
                //     hide: true,
                //   },
                // },
                {
                  name: "Service History Records",
                  list: "/service_history_records",
                  create: "/service_history_records/create",
                  edit: "/service_history_records/edit/:id",
                  icon: <ServiceIcon />,
                  meta: {
                    canDelete: false,
                  },
                },
                {
                  name: "addresses",
                  list: "/addresses",
                  create: "/addresses/create",
                  edit: "/addresses/edit/:id",
                  icon: <MapIcon />,
                  meta: {
                    canDelete: false,
                  },
                },
              ]}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
            >
              {renderComponent()}
              <RefineKbar />
              <UnsavedChangesNotifier />
            </Refine>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
}

export default appWithTranslation(MyApp);
