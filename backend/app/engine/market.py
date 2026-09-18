from collections import Counter


def percentage(count: int, total: int) -> float:
    if total == 0:
        return 0.0
    return round((count / total) * 100, 2)


def count_with_percentage(values: list) -> list[dict]:
    counts = Counter(values)
    total = len(values)

    return [
        {
            "value": value,
            "mentions": count,
            "percentage": percentage(count, total)
        }
        for value, count in counts.most_common()
    ]


def process_survey_responses(responses: list[dict]) -> dict:

    business_names = []
    difficult_products = []
    local_problems = []
    desired_businesses = []
    outside_area_products = []

    purchase_frequencies = []
    purchase_locations = []
    distribution_channels = []
    purchase_priorities = []

    seasonal_demands = []
    high_demand_changes = []
    biggest_local_problems = []

    spending_values = []
    current_prices = []
    too_expensive_prices = []

    for response in responses:

        if response.get("usual_business_name"):
            business_names.append(
                response["usual_business_name"]
            )

        business_names.extend(
            response.get("other_business_names", [])
        )

        difficult_products.extend(
            response.get("difficult_to_find_products", [])
        )

        local_problems.extend(
            response.get("local_problems", [])
        )

        if response.get("desired_local_business"):
            desired_businesses.append(
                response["desired_local_business"]
            )

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

        if response.get("purchase_priority"):
            purchase_priorities.append(
                response["purchase_priority"]
            )

        if response.get("travel_outside_area") and response.get(
            "outside_area_product"
        ):
            outside_area_products.append(
                response["outside_area_product"]
            )

        if response.get("seasonal_demand"):
            seasonal_demands.append(
                response["seasonal_demand"]
            )

        if response.get("high_demand_change"):
            high_demand_changes.append(
                response["high_demand_change"]
            )

        if response.get("biggest_local_problem"):
            biggest_local_problems.append(
                response["biggest_local_problem"]
            )

        if response.get("typical_spending") is not None:
            spending_values.append(
                response["typical_spending"]
            )

        if response.get("current_price") is not None:
            current_prices.append(
                response["current_price"]
            )

        if response.get("too_expensive_price") is not None:
            too_expensive_prices.append(
                response["too_expensive_price"]
            )

    average_spending = (
        sum(spending_values) / len(spending_values)
        if spending_values
        else None
    )

    average_current_price = (
        sum(current_prices) / len(current_prices)
        if current_prices
        else None
    )

    average_too_expensive_price = (
        sum(too_expensive_prices) / len(too_expensive_prices)
        if too_expensive_prices
        else None
    )

    return {
        "sample_size": len(responses),

        "observed_competitors": [
            {
                "name": name,
                "mentions": count,
                "percentage": percentage(count, len(responses))
            }
            for name, count in Counter(business_names).most_common()
        ],

        "underserved_niches": [
            {
                "product": product,
                "mentions": count,
                "percentage": percentage(count, len(responses))
            }
            for product, count in Counter(
                difficult_products
            ).most_common()
        ],

        "desired_local_businesses": [
            {
                "business": business,
                "mentions": count,
                "percentage": percentage(count, len(responses))
            }
            for business, count in Counter(
                desired_businesses
            ).most_common()
        ],

        "local_problems": [
            {
                "problem": problem,
                "mentions": count,
                "percentage": percentage(count, len(responses))
            }
            for problem, count in Counter(
                local_problems
            ).most_common()
        ],

        "purchase_behavior": {
            "purchase_frequency": count_with_percentage(
                purchase_frequencies
            ),

            "purchase_location": count_with_percentage(
                purchase_locations
            ),

            "average_typical_spending": (
                round(average_spending, 2)
                if average_spending is not None
                else None
            ),

            "preferred_distribution_channels": count_with_percentage(
                distribution_channels
            ),

            "outside_area_products": [
                {
                    "product": product,
                    "mentions": count,
                    "percentage": percentage(count, len(responses))
                }
                for product, count in Counter(
                    outside_area_products
                ).most_common()
            ]
        },

        "pricing_evidence": {
            "average_current_price": (
                round(average_current_price, 2)
                if average_current_price is not None
                else None
            ),
            "average_too_expensive_price": (
                round(average_too_expensive_price, 2)
                if average_too_expensive_price is not None
                else None
            )
        },

        "purchase_priorities": count_with_percentage(
            purchase_priorities
        ),

        "seasonality": {
            "seasonal_demand": count_with_percentage(
                seasonal_demands
            ),
            "high_demand_change": count_with_percentage(
                high_demand_changes
            )
        },

        "biggest_local_problems": [
            {
                "problem": problem,
                "mentions": count,
                "percentage": percentage(count, len(responses))
            }
            for problem, count in Counter(
                biggest_local_problems
            ).most_common()
        ]
    }

def evaluate_market_evidence(evidence: dict) -> dict:

    categories = []

    if evidence.get("purchase_behavior", {}).get("purchase_frequency"):
        categories.append("demand")

    if evidence.get("underserved_niches"):
        categories.append("unmet_demand")

    if evidence.get("purchase_behavior", {}).get("outside_area_products"):
        categories.append("supply_gap")

    if evidence.get("observed_competitors"):
        categories.append("competition")

    if evidence.get("local_problems"):
        categories.append("local_problems")

    pricing = evidence.get("pricing_evidence", {})
    if (
        pricing.get("average_current_price") is not None
        or pricing.get("average_too_expensive_price") is not None
    ):
        categories.append("pricing")

    seasonality = evidence.get("seasonality", {})
    if (
        seasonality.get("seasonal_demand")
        or seasonality.get("high_demand_change")
    ):
        categories.append("seasonality")

    if evidence.get("purchase_behavior", {}).get(
        "preferred_distribution_channels"
    ):
        categories.append("distribution")

    category_count = len(categories)

    if category_count <= 2:
        market_status = "LIMITED"
    elif category_count <= 5:
        market_status = "MODERATE"
    else:
        market_status = "STRONG"

    return {
    "market_status": "UNKNOWN",
    "evidence_coverage": market_status,
    "sample_size": evidence.get("sample_size", 0),
    "evidence_category_count": category_count,
    "evidence_categories": categories
}

def analyze_market_reach(evidence: dict) -> dict:
    purchase_behavior = evidence.get(
        "purchase_behavior", {}
    )

    frequency = purchase_behavior.get(
        "purchase_frequency", []
    )

    locations = purchase_behavior.get(
        "purchase_location", []
    )

    channels = purchase_behavior.get(
        "preferred_distribution_channels", []
    )

    outside_area = purchase_behavior.get(
        "outside_area_products", []
    )

    return {
        "purchase_frequency": frequency,
        "current_purchase_locations": locations,
        "preferred_distribution_channels": channels,
        "outside_area_demand": outside_area,
        "consumer_base_5_10_km": None
    }

def analyze_competitor_mapping(evidence: dict) -> dict:
    observed_competitors = evidence.get(
        "observed_competitors", []
    )

    return {
        "observed_competitor_count": len(
            observed_competitors
        ),
        "observed_competitors": observed_competitors,
        "coverage": "survey_observed"
    }

def analyze_opportunities(evidence: dict) -> dict:
    underserved_niches = evidence.get(
        "underserved_niches", []
    )

    return {
        "observed_demand_gaps": underserved_niches,
        "opportunity_count": len(underserved_niches),
        "coverage": "survey_observed"
    }

def analyze_product_market_value(evidence: dict) -> dict:
    purchase_behavior = evidence.get(
        "purchase_behavior", {}
    )

    pricing_evidence = evidence.get(
        "pricing_evidence", {}
    )

    return {
        "average_typical_spending": purchase_behavior.get(
            "average_typical_spending"
        ),

        "purchase_priorities": evidence.get(
            "purchase_priorities", []
        ),

        "pricing_signals": {
            "average_current_price": pricing_evidence.get(
                "average_current_price"
            ),
            "average_too_expensive_price": pricing_evidence.get(
                "average_too_expensive_price"
            )
        },

        "regional_purchasing_power": None,

        "coverage": "survey_observed"
    }

def analyze_swot(evidence: dict) -> dict:
    purchase_behavior = evidence.get(
        "purchase_behavior", {}
    )

    opportunities = evidence.get(
        "underserved_niches", []
    )

    local_problems = evidence.get(
        "local_problems", []
    )

    seasonality = evidence.get(
        "seasonality", {}
    )

    competitors = evidence.get(
        "observed_competitors", []
    )

    return {
        "strengths": {
            "purchase_frequency": purchase_behavior.get(
                "purchase_frequency", []
            ),
            "purchase_priorities": evidence.get(
                "purchase_priorities", []
            )
        },

        "weaknesses": {
            "local_problems": local_problems
        },

        "opportunities": {
            "underserved_niches": opportunities,
            "outside_area_demand": purchase_behavior.get(
                "outside_area_products", []
            ),
            "preferred_distribution_channels": purchase_behavior.get(
                "preferred_distribution_channels", []
            )
        },

        "threats": {
            "observed_competitors": competitors,
            "seasonality": seasonality
        },

        "coverage": "survey_observed"
    }

def analyze_threats(evidence: dict) -> dict:
    local_problems = evidence.get(
        "local_problems", []
    )

    seasonality = evidence.get(
        "seasonality", {}
    )

    outside_area_products = evidence.get(
        "purchase_behavior", {}
    ).get(
        "outside_area_products", []
    )

    return {
        "supply_chain_signals": outside_area_products,
        "seasonality_signals": seasonality,
        "local_problem_signals": local_problems,
        "single_buyer_dependency": None
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
