let app = new Vue({
    el: '#app',
    data: {
        mealList: [{
            name: "Nothing",
            cost: 0,
        }, ],
        days: [],
        currentMeal: "",
        currentCost: 0,
        currentDayMeal: '',
        totalCost: 0,

    },
    computed: {
        // This function takes the cost from each meal and sums them.
        /*totalCost() {
            let cost = 0;
            for (let i = 0; i < this.days.length; i++) {
                for (let j = 0; j < this.days[i].meals.length; j++) {
                    cost += Number(this.days[i].meals[j].cost);
                }
            }
            return cost;
        },*/
    },
    created() {
        let day_names = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (let i = 0; i < day_names.length; i++) {
            this.days[i] = {
                day_name: day_names[i],
                meals: [],
                currentDayMeal: null,
            };
        }
    },
    methods: {
        addRecipe() {
            if (this.currentMeal !== "") {
                if (this.currentCost === "")
                    this.currentCost = 0;
                this.mealList.push({
                    name: this.currentMeal,
                    cost: this.currentCost,
                });
                this.currentMeal = "";
                this.currentCost = 0;
            }
        },
        addMealToDay(day) {
            let mealArray = day.currentDayMeal.split("$");
            day.meals.push({
                name: mealArray[0],
                cost: mealArray[1],
            });
            this.totalCost += Number(mealArray[1]);
        },
    },

});