from app.agents.tools import enriched_interaction


def test_enriched_interaction_extracts_core_crm_fields():
    draft = enriched_interaction(
        {
            "message": (
                "Met Dr. Rao, cardiologist at Apollo Heart Institute, to discuss "
                "Cardiostat XR. She was positive and requested outcomes data."
            )
        }
    )

    assert draft["hcp_name"] == "Dr. Rao"
    assert draft["specialty"] == "Cardiology"
    assert draft["organization"] == "Apollo Heart Institute"
    assert draft["products_discussed"] == ["Cardiostat XR"]
    assert draft["sentiment"] == "Positive"
    assert draft["follow_up_required"] is True
    assert draft["action_items"]
