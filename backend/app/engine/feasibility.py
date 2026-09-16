from collections import Counter


def process_survey_responses(responses: list[dict]) -> dict:
    business_names = []
    difficult_products = []
    local_problems = []

    purchase_frequencies = []
    purchase_locations = []
    distribution_channels = []
    spending_values = []
    outside_area_products = []

    purchase_priorities = []
    seasonal_demands = []
    high_demand_changes = []
    biggest_local_problems = []

    for response in responses:

        # Competitors
        if response.get("usual_business_name"):
            business_names.append(
                response["usual_business_name"]
            )

        business_names.extend(
            response.get("other_business_names", [])
        )

        # Underserved products
        difficult_products.extend(
            response.get("difficult_to_find_products", [])
        )

        # Local problems
        local_problems.extend(
            response.get("local_problems", [])
        )

        # Purchase behavior
        if response.get("purchase_frequency"):
            purchase_frequencies.append(
                response["purchase_frequency"]
            )

        if response.get("purchase_location"):
            purchase_locations.append(
                response["purchase_location"]
            )

        if response.get("preferred_distribution_channel"):
            distribution_channels.append(
                response["preferred_distribution_channel"]
            )

        if response.get("typical_spending") is not None:
            spending_values.append(
                response["typical_spending"]
            )

        # Outside-area purchases
        if (
            response.get("travel_outside_area")
            and response.get("outside_area_product")
        ):
            outside_area_products.append(
                response["outside_area_product"]
            )

        # Purchase priority
        if response.get("purchase_priority"):
            purchase_priorities.append(
                response["purchase_priority"]
            )

        # Seasonality
        if response.get("seasonal_demand"):
            seasonal_demands.append(
                response["seasonal_demand"]
            )

        if response.get("high_demand_change"):
            high_demand_changes.append(
                response["high_demand_change"]
            )

        # Biggest local problem
        if response.get("biggest_local_problem"):
            biggest_local_problems.append(
                response["biggest_local_problem"]
            )

    # Counts
    competitor_counts = Counter(business_names)
    opportunity_counts = Counter(difficult_products)
    problem_counts = Counter(local_problems)

    frequency_counts = Counter(purchase_frequencies)
    location_counts = Counter(purchase_locations)
    channel_counts = Counter(distribution_channels)

    outside_product_counts = Counter(
        outside_area_products
    )

    priority_counts = Counter(
        purchase_priorities
    )

    seasonal_demand_counts = Counter(
        seasonal_demands
    )

    high_demand_change_counts = Counter(
        high_demand_changes
    )

    biggest_problem_counts = Counter(
        biggest_local_problems
    )

    # Average spending
    average_spending = (
        sum(spending_values) / len(spending_values)
        if spending_values
        else None
    )

    return {
        "competitors": [
            {
                "name": name,
                "mentions": count
            }
            for name, count in competitor_counts.most_common()
        ],

        "underserved_niches": [
            {
                "product": product,
                "mentions": count
            }
            for product, count in opportunity_counts.most_common()
        ],

        "local_problems": [
            {
                "problem": problem,
                "mentions": count
            }
            for problem, count in problem_counts.most_common()
        ],

        "purchase_behavior": {
            "purchase_frequency": [
                {
                    "frequency": frequency,
                    "mentions": count
                }
                for frequency, count in frequency_counts.most_common()
            ],

            "purchase_location": [
                {
                    "location": location,
                    "mentions": count
                }
                for location, count in location_counts.most_common()
            ],

            "average_typical_spending": average_spending,

            "preferred_distribution_channels": [
                {
                    "channel": channel,
                    "mentions": count
                }
                for channel, count in channel_counts.most_common()
            ],

            "outside_area_products": [
                {
                    "product": product,
                    "mentions": count
                }
                for product, count in outside_product_counts.most_common()
            ]
        },

        "purchase_priorities": [
            {
                "priority": priority,
                "mentions": count
            }
            for priority, count in priority_counts.most_common()
        ],

        "seasonality": {
            "seasonal_demand": [
                {
                    "response": response,
                    "mentions": count
                }
                for response, count in seasonal_demand_counts.most_common()
            ],

            "high_demand_change": [
                {
                    "response": response,
                    "mentions": count
                }
                for response, count in high_demand_change_counts.most_common()
            ]
        },

        "biggest_local_problems": [
            {
                "problem": problem,
                "mentions": count
            }
            for problem, count in biggest_problem_counts.most_common()
        ],

        "total_responses": len(responses)
    }


def generate_feasibility_structure() -> dict:
    return {
        "market_reach": {
            "consumer_base_5_10_km": None,
            "distribution_channels": []
        },
        "opportunity_analysis": {
            "underserved_niches": []
        },
        "swot": {
            "strengths": [],
            "weaknesses": [],
            "opportunities": [],
            "threats": []
        },
        "threats": {
            "supply_chain": [],
            "seasonality": [],
            "single_buyer_dependency": []
        },
        "competitor_mapping": {
            "business_density": None,
            "competitors": []
        },
        "product_market_value": {
            "pricing_strategy": None,
            "regional_purchasing_power": None
        }
    }


def check_financial_feasibility(
    monthly_profit: float,
    required_project_cost: float,
    maximum_project_cost: float
) -> dict:

    business_viable = monthly_profit > 0
    financing_available = (
        required_project_cost <= maximum_project_cost
    )

    return {
        "business_viable": business_viable,
        "financing_available": financing_available,
        "feasible": business_viable and financing_available
    }