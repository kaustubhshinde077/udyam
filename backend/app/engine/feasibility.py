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
    current_prices = []
    too_expensive_prices = []

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
        
        if response.get("current_price") is not None:
            current_prices.append(response["current_price"])

        if response.get("too_expensive_price") is not None:
            too_expensive_prices.append(response["too_expensive_price"])


    # Counts

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
        "observed_competitors": [
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

        "pricing_evidence": {
            "average_current_price": average_current_price,
            "average_too_expensive_price": average_too_expensive_price
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

def evaluate_financial_feasibility(
    financing: dict,
    project_size: dict,
    scheme: dict,
    financial: dict,
    repayment: dict | None
) -> dict:

    if project_size["resize_required"]:
        return {
            "decision": "RESIZE",
            "reason": "Required project cost exceeds financing capacity.",
            "financial_status": "sufficient",
        }

    if scheme.get("scheme") is None:
        return {
            "decision": "NO",
            "reason": "Project is not eligible for an available scheme.",
            "financial_status": "sufficient",
        }

    if financial["monthly_profit"] <= 0:
        return {
            "decision": "NO",
            "reason": "Business does not generate a positive monthly profit.",
            "financial_status": "sufficient",
        }

    if repayment is None or financial["monthly_profit"] < repayment["monthly_emi"]:
        return {
            "decision": "RESIZE",
            "reason": "Monthly profit is insufficient to cover the loan EMI.",
            "financial_status": "sufficient",
        }

    return {
        "decision": "VIABLE",
        "reason": "Project is within financing capacity and can cover the estimated loan EMI.",
        "financial_status": "sufficient",
    }

def decision_engine(
    financial_result: dict,
    market_evidence: dict
) -> dict:

    required_project_cost = financial_result.get(
        "required_project_cost"
    )

    maximum_project_cost = financial_result.get(
        "maximum_project_cost"
    )

    monthly_profit = financial_result.get(
        "monthly_profit"
    )

    if (
        required_project_cost is None
        or maximum_project_cost is None
        or monthly_profit is None
    ):
        return {
            "decision": "NO",
            "reason_codes": [
                "insufficient_financial_data"
            ],
            "evidence_status": "limited",
            "next_action": "provide_missing_financial_data"
        }

    if required_project_cost > maximum_project_cost:
        return {
            "decision": "RESIZE",
            "reason_codes": [
                "project_exceeds_financing_capacity"
            ],
            "evidence_status": "limited",
            "next_action": "resize_business_model"
        }

    if monthly_profit <= 0:
        return {
            "decision": "NO",
            "reason_codes": [
                "negative_or_zero_operating_profit"
            ],
            "evidence_status": "limited",
            "next_action": "rework_business_model"
        }

    purchase_behavior = market_evidence.get(
        "purchase_behavior", {}
    )

    demand_signals = []

    if purchase_behavior.get("purchase_frequency"):
        demand_signals.append(
            "purchase_frequency_observed"
        )

    if market_evidence.get("underserved_niches"):
        demand_signals.append(
            "underserved_demand_observed"
        )

    if purchase_behavior.get("outside_area_products"):
        demand_signals.append(
            "outside_area_demand_observed"
        )

    evidence_status = (
        "sufficient"
        if demand_signals
        else "limited"
    )

    return {
        "decision": "VIABLE",
        "reason_codes": [
            "within_financing_capacity",
            "positive_operating_profit"
        ],
        "evidence_status": evidence_status,
        "demand_signals": demand_signals,
        "next_action": "proceed_to_scheme_router"
    }