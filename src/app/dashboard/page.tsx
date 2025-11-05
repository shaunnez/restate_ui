"use client";

import React, { useState } from "react";
import Script from "next/script";
import { Card, CardContent, Checkbox, Typography } from "@mui/material";
import { useTable } from "@refinedev/core";

let theTimeout = null as any;

const Dashboard = () => {
  const [selectedStatusList, setSelectedStatusList] = useState([1, 2]);
  const [markers, setMarkers] = useState([] as any[]);

  const { tableQuery } = useTable<any, any>({
    resource: "sites",
    pagination: {
      mode: "off",
    },
    meta: {
      select:
        "*, addresses(description, lat, lng), categories(name), customers(name), assets(count)",
    },
  });

  const statusToColor = {
    0: "blue",
    1: "blue",
    2: "yellow",
    3: "green",
    4: "red",
  };

  const statusToText = {
    0: "unknown",
    1: "Work Order",
    2: "Quote",
    3: "Completed",
    4: "Unsuccessful",
  };

  let map = null as any;

  function initMap() {
    const myLatLng = { lat: -36.8509, lng: 174.7645 };
    // @ts-ignore
    map = new window.google.maps.Map(
      document.getElementById("embed-map-canvas") as HTMLElement,
      {
        zoom: 12,
        center: myLatLng,
      }
    );
  }

  const initMarkers = () => {
    const data = tableQuery?.data?.data || [];
    const tempMarkers = [] as any[];
    // @ts-ignore
    data.forEach((x: any) => {
      if (x.addresses) {
        // @ts-ignore
        const marker = new window.google.maps.Marker({
          position: { lat: x.addresses.lat, lng: x.addresses.lng },
          map,
          title: x.addresses.description,
          status: x.status,
          visible: selectedStatusList.indexOf(x.status) > -1,
          icon: {
            url: `http://maps.google.com/mapfiles/ms/icons/${
              // @ts-ignore
              statusToColor[x.status]
            }-dot.png`,
          },
        });
        // @ts-ignore
        marker["infowindow"] = new window.google.maps.InfoWindow({
          content: `<b>Job:</b> <a href='/sites/edit/${x.id}'>${
            x.job_id
          }</a><br/><b>Category</b>: ${
            x.categories?.name
          }<br/><b>Customer</b>: ${x.customers?.name}<br/><b>Address</b>: ${
            x.addresses.description
          }<br/><b>Assets</b>: ${
            x.assets.length > 0 ? x.assets[0].count : "0"
          }<br/><b>Status</b>: ${
            // @ts-ignore
            statusToText[x.status]
          }  `,
        });
        tempMarkers.push(marker);
        // @ts-ignore
        google.maps.event.addListener(marker, "mouseover", function () {
          // @ts-ignore
          tempMarkers.forEach((x) => {
            // @ts-ignore
            x["infowindow"].close(map, this);
          });
          // @ts-ignore
          this["infowindow"].open(map, this);
        });
      }
    });
    // @ts-ignore
    // var markerCluster = new MarkerClusterer({ map, markers: tempMarkers });
    setMarkers(tempMarkers);
  };

  const checkGoogle = () => {
    // @ts-ignore
    if (window && window.google) {
      initMap();
      initMarkers();
    } else {
      clearTimeout(theTimeout);
      theTimeout = setTimeout(() => {
        checkGoogle();
      }, 1000);
    }
  };

  const handleChangeStatus = (e: any) => {
    const clone = ([] as number[]).concat(selectedStatusList);
    const val = Number(e.target.value);
    const pos = clone.indexOf(val);
    if (pos > -1) {
      clone.splice(pos, 1);
    } else {
      clone.push(val);
    }
    setSelectedStatusList(clone);
  };

  React.useEffect(() => {
    if (!tableQuery.isLoading) {
      checkGoogle();
    }
  }, [tableQuery.isLoading]);

  React.useEffect(() => {
    markers.forEach((x: any, i: number) => {
      if (selectedStatusList.indexOf(x.status) > -1) {
        x.setVisible(true);
      } else {
        x.setVisible(false);
      }
    });
  }, [selectedStatusList]);
  return (
    <div>
      <Script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDnqaI9lrw8c7JyvKvdxx-F2lp6MsaH080&libraries=places" />
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Dashboard
          </Typography>
          <div className="checkbox-list">
            <div className="checkbox-item">
              <label style={{ background: "blue" }}>
                Work Order
                <Checkbox
                  value="1"
                  checked={selectedStatusList.indexOf(1) > -1}
                  onChange={handleChangeStatus}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label style={{ background: "yellow", color: "black" }}>
                Quote
                <Checkbox
                  value="2"
                  checked={selectedStatusList.indexOf(2) > -1}
                  onChange={handleChangeStatus}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label style={{ background: "green" }}>
                Completed
                <Checkbox
                  value="3"
                  checked={selectedStatusList.indexOf(3) > -1}
                  onChange={handleChangeStatus}
                />
              </label>
            </div>
            <div className="checkbox-item">
              <label style={{ background: "red" }}>
                Unsuccessful
                <Checkbox
                  value="4"
                  checked={selectedStatusList.indexOf(4) > -1}
                  onChange={handleChangeStatus}
                />
              </label>
            </div>
          </div>
          <div>
            <div
              id="embed-map-canvas"
              style={{
                width: "100%",
                height: "calc(100vh - 250px)",
                color: "black",
              }}
            ></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
