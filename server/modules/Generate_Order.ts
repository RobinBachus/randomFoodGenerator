import {Takeaway} from "takeaway";

export let progress: number = 0;
export let total: number = 0;

export async function getFoodItem(_response:any): Promise<string> {
    try {
        // throwDebugError();
        const takeaway = new Takeaway();

        const postalCode = _response.postalCode;         // String: User specified postal code for accurate
        const searchTerm = _response.searchTerm;         // String: Term to search for in menu's
        const includeOpen = _response.openChecked;       // Bool: Include open restaurants in search
        const includeClosed = _response.closeChecked;    // Bool: Include closed restaurants in search
        const country = await takeaway.getCountryById(_response.country);
        const restaurants = await country.getRestaurants(postalCode , '51.254361', '4.282446');

        let food = [];

        if (!includeOpen && !includeClosed) {
            return "";
        }
        let i = 0;
        total = restaurants.length;
        for (const restaurant of restaurants) {
            i += 1;
            progress = i;
            console.clear();
            console.log(progress + "/" + total);
            await restaurant.getMenu(postalCode);

            if (restaurant.categories && restaurant.open === includeOpen || restaurant.open === !includeClosed) {
                for (const category of restaurant.categories) {
                    for (const product of category.products) {
                        if (product.name && product.name.toLowerCase().includes(searchTerm)) {
                            food.push(restaurant.name + " || " + product.name + " || €" + product.deliveryPrice / 100);
                        }
                    }
                }
            }

            console.clear();
            console.log(i + "/" + restaurants.length);
        }
        return food.join(";;");
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// function throwDebugError() {
//     let error = new Error("Debug Test Error");
//     error.name = "Test Error";
//     throw error;
// }
