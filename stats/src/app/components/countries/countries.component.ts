import { Component, OnInit } from "@angular/core";
import { ChartOptions, ChartType, ChartDataSets } from "chart.js";
import { DataServiceService } from "src/app/services/data-service.service";
import { Color, Label } from "ng2-charts";
@Component({
    selector: "app-countries",
    templateUrl: "./countries.component.html",
    styleUrls: ["./countries.component.css"],
})
export class CountriesComponent implements OnInit {
    public totalconfirmed;
    public totaldeceased;
    public totalrecovered;
    city;
    state;
    constructor(private dataService: DataServiceService) {}
    public barChartOptions = {
        responsive: true,
        options: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: "red",
                },
            },
        },
    };

    public barChartLabels = new Array();
    public barChartType = "line";
    public barChartLegend = true;
    public barChartData = [{ data: [], label: "Total Confirmed  " }];
    public BarChartColors: Color[] = [
        {
            borderColor: "#d64161",
            backgroundColor: "rgba(255,0,0,0.3)",
        },
    ];

    public stateBarChartLabels = new Array();
    public stateBarChartType: ChartType = "bar";
    public stateBarChartLegend = true;
    public stateBarData = [{ data: [], label: "Total Confirmed  " }];
    public stateBarChartOptions = {
        scaleShowVerticalLines: false,
        responsive: true,
        options: {
            legend: {
                labels: {
                    // This more specific font property overrides the global property
                    fontColor: "red",
                },
            },
        },
    };
    public pieChartOptions: ChartOptions = {
        responsive: true,
        legend: {
            display: true,
            labels: { fontColor: "black" },
            position: "top",
        },
        plugins: {
            datalabels: {
                formatter: (value, ctx) => {
                    const label = ctx.chart.data.labels[ctx.dataIndex];
                    return label;
                },
            },
        },
    };
    public PieChartLabels = new Array();
    public PieChartType: ChartType = "pie";
    public PieChartLegend = true;
    public PieData = [{ data: [], label: "Total Confirmed" }];
    public pieChartColors = [
        {
            backgroundColor: [
                "rgba(255,0,0,0.5)",
                "rgb(169,169,169,0.6)",
                "rgb(0,255,0,0.3)",
            ],
        },
    ];
    public active = new Array();

    ngOnInit() {
        this.getStateData();
        this.getDailyData();
        this.geoLocation();
    }
    geoLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.dataService
                    .getLocation(
                        position.coords.latitude,
                        position.coords.longitude
                    )
                    .subscribe((res) => {
                        this.city = res.results[0].components.city;
                        this.state = res.results[0].components.state;
                        console.log(res.results[0].components);
                    });
                console.log("position", position);
            });
        }
    }
    getStateData() {
        this.dataService.getIndiaStateData().subscribe((res) => {
            // console.log(res);
            let i = 0;
            for (i = 0; i < res.length; i++) {
                this.stateBarData[0].data.push(res[i].active);
                this.stateBarChartLabels.push(res[i].statecode);
            }

            this.stateBarChartLabels.reverse();
            this.stateBarData[0].data.reverse();
            this.stateBarData[0].data.pop();
        });
    }
    getDailyData() {
        this.dataService.getDailyData().subscribe((res) => {
            // console.log(res);
            let i = 0;
            for (i = 0; i < res.length; i++) {
                this.active.push(res[i].totalconfirmed);
                this.barChartLabels.push(res[i].date);
            }
            this.PieData[0].data = [
                this.active[i - 1],
                res[i - 1].totaldeceased,
                res[i - 1].totalrecovered,
            ];
            this.totalconfirmed = this.active[i - 1];
            this.totaldeceased = this.PieData[0].data[1];
            this.totalrecovered = this.PieData[0].data[2];
            this.PieChartLabels = [
                "Total confirmed",
                "Total deceased",
                "Total Recovered",
            ];
            this.barChartData[0].data = this.active;
            // console.log(this.active);
        });
    }
}
