def validate_labor_spend(total_cost, projected_sales, threshold_percent):
    """
    Validates if the scheduled labor costs stay within the manager's target budget.
    Reflects experience in high-volume financial operations.
    """
    if projected_sales <= 0:
        return "Error: Projected sales must be greater than zero."

    labor_ratio = (total_cost / projected_sales) * 100
    
    if labor_ratio > threshold_percent:
        return {
            "status": "Warning",
            "ratio": round(labor_ratio, 2),
            "message": f"Labor is at {labor_ratio:.1f}% of sales, exceeding your {threshold_percent}% goal."
        }
    
    return {
        "status": "Healthy",
        "ratio": round(labor_ratio, 2),
        "message": f"Labor budget is on track at {labor_ratio:.1f}%."
    }
  
