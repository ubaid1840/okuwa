"use client";

import React, { useLayoutEffect } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5index from "@amcharts/amcharts5/index";
import * as am5percent from "@amcharts/amcharts5/percent";
import * as am5radar from "@amcharts/amcharts5/radar";
import { useColorMode } from "@chakra-ui/react";

const LineChart = ({ id, title, data, label }) => {
  const { colorMode } = useColorMode();

  useLayoutEffect(() => {
    let root = am5.Root.new(id);

    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: true,
        wheelX: "panX",
        wheelY: "zoomX",
        pinchZoomX: true,
      })
    );

    let xAxis = chart.xAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "entry",
        renderer: am5xy.AxisRendererX.new(root, {
          minGridDistance: 30,
        }),
      })
    );

    xAxis.get("renderer").labels.template.setAll({
      fill: colorMode === 'light' ? "#000000" : "#cbd5e0",
    });

    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    // Set color for y-axis labels
    yAxis.get("renderer").labels.template.setAll({
      fill: colorMode === 'light' ? "#000000" : "#cbd5e0",
    });

    let series = chart.series.push(
      am5xy.LineSeries.new(root, {
        name: title,
        xAxis: xAxis,
        yAxis: yAxis,
        valueYField: "value",
        categoryXField: "entry",
        tooltip: am5.Tooltip.new(root, {
          labelText: "{valueY}",
        }),
      })
    );

    // Prepare data
    const chartData = data.map((value, index) => ({
      entry: label[index],
      value: value,
    }));

    // Set data
    series.data.setAll(chartData);
    xAxis.data.setAll(chartData);

    return () => {
      root.dispose();
    };
  }, [id, title, data, colorMode]);

  return <div id={id} style={{ width: "100%", height: "500px" }}></div>;
};


  const ColumnChart = ({ id, title, data, label, value }) => {
    const {colorMode} = useColorMode()
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: "panX",
          wheelY: "zoomX",
          pinchZoomX: true,
        })
      );
  
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "entry",
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 30,
          }),
        })
      );
  
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {}),
        })
      );
  
      let series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
          name: title,
          xAxis: xAxis,
          yAxis: yAxis,
          valueYField: "value",
          categoryXField: "entry",
          tooltip: am5.Tooltip.new(root, {
            labelText: "{valueY}",
          }),
        })
      );
  
      const chartData = data.map((value, index) => ({
        entry: label[index],
        value: value,
      }));
  
  
      series.data.setAll(chartData);
      xAxis.data.setAll(chartData);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data]);
  
    return <div id={id} style={{ width: "100%", height: "500px" }}></div>;
  };

  const GaugeChart = ({ id, title, data, label, value }) => {
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(
        am5radar.RadarChart.new(root, {
          panX: false,
          panY: false,
          startAngle: 160,
          endAngle: 380,
        })
      );
  
      // Create axis and its renderer
      let axisRenderer = am5radar.AxisRendererCircular.new(root, {
        innerRadius: 0,
      });
  
      axisRenderer.grid.template.setAll({
        stroke: root.interfaceColors.get("background"),
        visible: true,
        strokeOpacity: 0.8,
      });
  
      let xAxis = chart.xAxes.push(
        am5xy.ValueAxis.new(root, {
          maxDeviation: 0,
          min: 0,
          max: 100,
          strictMinMax: true,
          renderer: axisRenderer,
        })
      );
  
      // Add clock hand
      let axisDataItem = xAxis.makeDataItem({});
  
      let clockHand = am5radar.ClockHand.new(root, {
        pinRadius: am5.percent(20),
        radius: am5.percent(100),
        bottomWidth: 40,
      });
  
      let bullet = axisDataItem.set(
        "bullet",
        am5xy.AxisBullet.new(root, {
          sprite: clockHand,
        })
      );
  
      xAxis.createAxisRange(axisDataItem);
  
      let label = chart.radarContainer.children.push(
        am5.Label.new(root, {
          fill: am5.color(0xffffff),
          centerX: am5.percent(50),
          textAlign: "center",
          centerY: am5.percent(50),
          fontSize: "3em",
        })
      );
  
      // Set the value of the needle to the provided data (assuming data is a single value)
      let needleValue = value || 50; // Default to 50 if no data provided
      axisDataItem.set("value", needleValue);
  
      bullet.get("sprite").on("rotation", function () {
        let value = axisDataItem.get("value");
        let fill = am5.color(0x000000);
        xAxis.axisRanges.each(function (axisRange) {
          if (value >= axisRange.get("value") && value <= axisRange.get("endValue")) {
            fill = axisRange.get("axisFill").get("fill");
          }
        });
  
        label.set("text", Math.round(value).toString());
  
        clockHand.pin.animate({
          key: "fill",
          to: fill,
          duration: 500,
          easing: am5.ease.out(am5.ease.cubic),
        });
        clockHand.hand.animate({
          key: "fill",
          to: fill,
          duration: 500,
          easing: am5.ease.out(am5.ease.cubic),
        });
      });
  
      chart.bulletsContainer.set("mask", undefined);
  
      // Create axis ranges bands
      let bandsData = data;
  
      am5.array.each(bandsData, function (data) {
        let axisRange = xAxis.createAxisRange(xAxis.makeDataItem({}));
  
        axisRange.setAll({
          value: data.lowScore,
          endValue: data.highScore,
        });
  
        axisRange.get("axisFill").setAll({
          visible: true,
          fill: am5.color(data.color),
          fillOpacity: 0.8,
        });
  
        axisRange.get("label").setAll({
          text: data.title,
          inside: true,
          radius: 15,
          fontSize: "0.9em",
          fill: root.interfaceColors.get("background"),
        });
      });
  
      // Make stuff animate on load
      chart.appear(1000, 100);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data]);
  
    return <div id={id} style={{ width: "100%", height: "500px" }}></div>;
  };

  const PieChart = ({ id, title, data }) => {
    const { colorMode } = useColorMode();
  
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(
        am5percent.PieChart.new(root, {
          endAngle: 270,
        })
      );
  
      // Create series
      let series = chart.series.push(
        am5percent.PieSeries.new(root, {
          valueField: "value",
          categoryField: "category",
          endAngle: 270,
        })
      );
  
      series.states.create("hidden", {
        endAngle: -90,
      });
  
      // Set data
      series.data.setAll(data);
  
      // Set color for slice borders
      series.slices.template.setAll({
        stroke: am5.color(colorMode === 'light' ? "#000000" : "#FFFFFF"),
      });
  
      // Set color for labels
      series.labels.template.setAll({
        fill: am5.color(colorMode === 'light' ? "#000000" : "#cbd5e0"),
      });
  
      series.appear(1000, 100);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data, colorMode]);
  
    return <div id={id} style={{ width: "100%", height: "300px" }}></div>;
  };
  

  const VariableRadius = ({ id, title, data }) => {
    const {colorMode} = useColorMode()
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(am5percent.PieChart.new(root, {
        layout: root.verticalLayout
      }));
      
      
      // Create series
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Series
      let series = chart.series.push(am5percent.PieSeries.new(root, {
        alignLabels: true,
        calculateAggregates: true,
        valueField: "value",
        categoryField: "category"
      }));
      
      series.slices.template.setAll({
        strokeWidth: 3,
        stroke: am5.color(colorMode == 'light' ? "#000000" : "#FFFFFF")
      });
      
      series.labelsContainer.set("paddingTop", 30)
      
      
      // Set up adapters for variable slice radius
      // https://www.amcharts.com/docs/v5/concepts/settings/adapters/
      series.slices.template.adapters.add("radius", function (radius, target) {
        let dataItem = target.dataItem;
        let high = series.getPrivate("valueHigh");
      
        if (dataItem) {
          let value = target.dataItem.get("valueWorking", 0);
          return radius * value / high
        }
        return radius;
      });
      
      
      // Set data
      // https://www.amcharts.com/docs/v5/charts/percent-charts/pie-chart/#Setting_data
      series.data.setAll(data);
      
      
      // Create legend
      // https://www.amcharts.com/docs/v5/charts/percent-charts/legend-percent-series/
      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50,
        marginTop: 15,
        marginBottom: 15
      }));
      
      legend.data.setAll(series.dataItems);
      
      
      // Play initial series animation
      // https://www.amcharts.com/docs/v5/concepts/animations/#Animation_of_series
      series.appear(1000, 100);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data]);
  
    return <div id={id} style={{ width: "100%", height: "300px" }}></div>;
  };

  const ClusterBar = ({ id, title, data, label }) => {
    const { colorMode } = useColorMode();
    
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        paddingLeft: 0,
        layout: root.verticalLayout
      }));
  
      // Create yAxis
      let yAxis = chart.yAxes.push(am5xy.CategoryAxis.new(root, {
        categoryField: "year",
        renderer: am5xy.AxisRendererY.new(root, {
          inversed: true,
          cellStartLocation: 0.1,
          cellEndLocation: 0.9,
          minorGridEnabled: true
        })
      }));
      
      yAxis.data.setAll(data);
  
      // Create xAxis
      let xAxis = chart.xAxes.push(am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererX.new(root, {
          strokeOpacity: 0.1,
          minGridDistance: 50
        }),
        min: 0
      }));
  
      // Apply color mode to x-axis labels
      xAxis.get("renderer").labels.template.setAll({
        fill: am5.color(colorMode === 'light' ? "#000000" : "#cbd5e0")
      });

      yAxis.get("renderer").labels.template.setAll({
        fill: colorMode === "light" ? "#000000" : "#cbd5e0",
      });
  
      // Add series function
      function createSeries(field, name) {
        let series = chart.series.push(am5xy.ColumnSeries.new(root, {
          name: name,
          xAxis: xAxis,
          yAxis: yAxis,
          valueXField: field,
          categoryYField: "year",
          sequencedInterpolation: true,
          tooltip: am5.Tooltip.new(root, {
            pointerOrientation: "horizontal",
            labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
          })
        }));
  
        series.columns.template.setAll({
          height: am5.p100,
          strokeOpacity: 0
        });
  
        // Bullet for displaying values
        series.bullets.push(() => {
          return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            sprite: am5.Label.new(root, {
              centerY: am5.p50,
              text: "{valueX}",
              populateText: true,
              fill: am5.color(colorMode === 'light' ? "#000000" : "#cbd5e0")
            })
          });
        });
  
        // Bullet for series name
        series.bullets.push(() => {
          return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            sprite: am5.Label.new(root, {
              centerX: am5.p100,
              centerY: am5.p50,
              text: "{name}",
              fill: am5.color("#ffffff"),
              populateText: true
            })
          });
        });
  
        series.data.setAll(data);
        series.appear();
        
        return series;
      }
  
      label.map((item) => {
        createSeries(item, item);
      });
  
      // Add legend
      let legend = chart.children.push(am5.Legend.new(root, {
        centerX: am5.p50,
        x: am5.p50
      }));
  
      legend.data.setAll(chart.series.values);
      legend.labels.template.setAll({
        fill: am5.color(colorMode === 'light' ? "#000000" : "#cbd5e0")
      });
  
      // Add cursor
      let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomY"
      }));
      cursor.lineY.set("forceHidden", true);
      cursor.lineX.set("forceHidden", true);
  
      chart.appear(1000, 100);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data, colorMode]);
  
    return <div id={id} style={{ width: "100%", height: "500px" }}></div>;
  };
  

  const ClusterColumn = ({ id, title, data, label }) => {
    const { colorMode } = useColorMode();
  
    useLayoutEffect(() => {
      let root = am5.Root.new(id);
  
      root.setThemes([am5themes_Animated.new(root)]);
  
      let chart = root.container.children.push(
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          paddingLeft: 0,
          wheelX: "panX",
          wheelY: "zoomX",
          layout: root.verticalLayout,
        })
      );
  
      let legend = chart.children.push(
        am5.Legend.new(root, {
          centerX: am5.p50,
          x: am5.p50,
        })
      );
  
      let xRenderer = am5xy.AxisRendererX.new(root, {
        cellStartLocation: 0.1,
        cellEndLocation: 0.9,
        minorGridEnabled: true,
      });
  
      let xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
          categoryField: "year",
          renderer: xRenderer,
          tooltip: am5.Tooltip.new(root, {}),
        })
      );
  
      xRenderer.grid.template.setAll({
        location: 1,
      });
  
      xAxis.data.setAll(data);
  
      xAxis.get("renderer").labels.template.setAll({
        fill: colorMode === "light" ? "#000000" : "#cbd5e0",
      });
  
      let yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
          renderer: am5xy.AxisRendererY.new(root, {
            strokeOpacity: 0.1,
          }),
        })
      );
  
      // Set color for y-axis labels
      yAxis.get("renderer").labels.template.setAll({
        fill: colorMode === "light" ? "#000000" : "#cbd5e0",
      });
  
      function makeSeries(name, fieldName) {
        let series = chart.series.push(
          am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: fieldName,
            categoryXField: "year",
          })
        );
  
        series.columns.template.setAll({
          tooltipText: "{name}, {categoryX}:{valueY}",
          width: am5.percent(90),
          tooltipY: 0,
          strokeOpacity: 0,
        });
  
        series.data.setAll(data);
  
        // Make stuff animate on load
        series.appear();
  
        series.bullets.push(function () {
          return am5.Bullet.new(root, {
            locationY: 0,
            sprite: am5.Label.new(root, {
              text: "{valueY}",
              fill: root.interfaceColors.get("alternativeText"),
              centerY: 0,
              centerX: am5.p50,
              populateText: true,
            }),
          });
        });
  
        legend.data.push(series);
      }
  
      label.map((item) => {
        makeSeries(item, item);
      });
  
      // Set color for legend labels
      legend.labels.template.setAll({
        fill: colorMode === "light" ? "#000000" : "#cbd5e0",
      });
  
      chart.appear(1000, 100);
  
      return () => {
        root.dispose();
      };
    }, [id, title, data]);
  
    return <div id={id} style={{ width: "100%", height: "500px" }}></div>;
  };
  


  export {LineChart, ColumnChart, PieChart, GaugeChart, ClusterBar, ClusterColumn, VariableRadius}