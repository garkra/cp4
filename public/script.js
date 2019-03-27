let app = new Vue({
    el: '#app',
    data: {
        mealList: [{
            title: "Nothing",
            cost: 0,
        }, ],
        days: [],
        currentMeal: "",
        currentCost: 0,
        currentDayMeal: '',
        totalCost: 0,
        mealInProgress: null,
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
        this.getmeals();
    },
    methods: {
        async addRecipe() {
            if (this.currentMeal !== "") {
                if (this.currentCost === "")
                    this.currentCost = 0;
                await this.upload({
                    title: this.currentMeal,
                    cost: this.currentCost,
                });

                this.getmeals();
                this.currentMeal = "";
                this.currentCost = 0;
            }
        },
        addMealToDay(day) {
            let mealArray = day.currentDayMeal.split("$");
            day.meals.push({
                title: mealArray[0],
                cost: mealArray[1],
            });
            this.totalCost += Number(mealArray[1]);
        },
        async upload(meal) {
            try {
                await axios.post('/api/meals', {
                    title: meal.title,
                    cost: meal.cost,
                });
            } catch (error) {
                console.log(error);
            }
        },
        async getmeals() {
            try {
                let response = await axios.get("/api/meals");
                this.mealList = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async deleteMeal(meal) {
            try {
                axios.delete("/api/meals/" + meal._id);
                this.mealInProgress = null;
                this.getmeals();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
        async editMeal(meal) {
            try {
                await axios.put("/api/meals/" + meal._id, {
                    title: this.mealInProgress.title,
                    cost: this.mealInProgress.cost,
                });
                this.mealInProgress = null;
                this.getmeals();
                return true;
            } catch (error) {
                console.log(error);
            }
        },
    },

});