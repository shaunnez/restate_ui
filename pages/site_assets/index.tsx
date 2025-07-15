import React from "react";
import {
  useDataGrid,
  EditButton,
  List,
  DateField,
  ExportButton,
} from "@refinedev/mui";
import { DataGrid } from "@mui/x-data-grid";

import { GetServerSideProps } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { authProvider } from "src/authProvider";
import { useExport, useSelect } from "@refinedev/core";

export const SiteAssetList = () => {
  const { triggerExport, isLoading: exportLoading } = useExport({
    resource: "site_assets",
    pageSize: 1000,
    meta: {
      select: "*, assets(old_id, serial_number, name), sites(name)",
    },
    mapData: (item, index) => {
      return {
        notes: item.notes,
        site: item.sites?.job_id,
        reference: item.purchase_order_number,
        old_id: item.assets?.old_id,
        serial_number: item.assets?.serial_number,
        asset: item.assets?.name,
        check_in_user: item.check_in_user,
        check_in_date: item.check_in,
        check_out_user: item.check_out_user,
        check_out_date: item.check_out,
      };
    },
  });

  const { dataGridProps, tableQueryResult } = useDataGrid({
    syncWithLocation: true,
    liveMode: "auto",
    resource: "site_assets",
    meta: {
      select: "*, assets(old_id, serial_number, name), sites(job_id, name)",
    },
    sorters: { initial: [{ field: "check_in", order: "asc" }] },
  });

  const columns = React.useMemo<any>(
    () => [
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }: any) {
          return (
            <>
              <EditButton hideText recordItemId={row.id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
      {
        field: "notes",
        flex: 1,
        headerName: "Notes",
        minWidth: 180,
      },
      {
        field: "sites.job_id",
        flex: 1,
        headerName: "Site",
        minWidth: 180,
        renderCell: (params: any) => {
          return params.row.sites?.job_id;
        },
      },
      {
        field: "purchase_order_number",
        flex: 1,
        headerName: "Reference",
        minWidth: 180,
      },
      {
        field: "old_id",
        flex: 1,
        headerName: "PNumber",
        minWidth: 120,
        renderCell: (params: any) => {
          return params.row.assets?.old_id;
        },
      },
      {
        field: "serial_number",
        flex: 1,
        headerName: "Serial No",
        minWidth: 120,
        renderCell: (params: any) => {
          return params.row.assets?.serial_number;
        },
      },
      {
        field: "assets.name",
        flex: 1,
        minWidth: 180,
        headerName: "Asset",
        renderCell: (params: any) => {
          return params.row.assets?.name;
        },
      },
      {
        field: "check_in_user",
        flex: 1,
        headerName: "Check In User",
        minWidth: 180,
      },
      {
        field: "check_in",
        flex: 1,
        headerName: "Check In Date",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
      {
        field: "check_out_user",
        flex: 1,
        headerName: "Check Out User",
        minWidth: 180,
      },
      {
        field: "check_out",
        flex: 1,
        headerName: "Check Out",
        minWidth: 180,
        renderCell: function render({ value }: any) {
          if (value) {
            return <DateField value={value} format="DD/MM/YYYY HH:mm:ss" />;
          }
          return null;
        },
      },
    ],
    []
  );

  // React.useEffect(() => {
  //   new Promise(async (resolve, reject) => {
  //     const results = await axios.get("/api/users");
  //     console.log(results.data);
  //   });
  // }, []);

  const columnKey = "siteAssetsColumns3";
  let columnVisibilityModel = {};
  // @ts-ignore
  if (
    typeof window !== "undefined" &&
    window?.sessionStorage?.getItem(columnKey)
  ) {
    columnVisibilityModel = JSON.parse(
      // @ts-ignore
      window?.sessionStorage.getItem(columnKey) as string
    );
  }

  return (
    <List
      headerButtons={({ defaultButtons }) => (
        <>
          {defaultButtons}{" "}
          <ExportButton onClick={triggerExport} loading={exportLoading} />
        </>
      )}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        autoHeight
        initialState={{
          columns: {
            columnVisibilityModel,
          },
        }}
        onColumnVisibilityModelChange={(newModel) => {
          window?.sessionStorage.setItem(columnKey, JSON.stringify(newModel));
        }}
      />
    </List>
  );
};

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const { authenticated, redirectTo } = await authProvider.check(context);

  const translateProps = await serverSideTranslations(context.locale ?? "en", [
    "common",
  ]);

  if (!authenticated) {
    return {
      props: {
        ...translateProps,
      },
      redirect: {
        destination: `${redirectTo}?to=${encodeURIComponent("/site_assets")}`,
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

export default SiteAssetList;
