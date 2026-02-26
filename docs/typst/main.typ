#set page(margin: 2.5cm)
#set par(leading: 0.55em, spacing: 1.5em, first-line-indent: 0pt, justify: true)
#show heading: set block(above: 1.4em, below: 1em)
#set text(font: "New Computer Modern")

// only first level headings on a new page
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  it
}

#include "000_front_matter/001_cover_page.typ"


// = Declaration of Authorship
// #include "000_front_matter/002_declaration_of_authorship.typ"

#heading(level: 1, outlined: false)[Acknowledgments]
#include "000_front_matter/003_acknowledgments.typ"

#show outline.entry.where(
  level: 1,
): set block(above: 1.2em)

#heading(level: 1, outlined: false)[Abstract]
#include "000_front_matter/004_abstract.typ"

#heading(level: 1, outlined: false)[Problem Statement]
#include "000_front_matter/005_problem_statement.typ"

#heading(level: 1, outlined: false)[System Objectives]
#include "000_front_matter/006_system_objectives_summary.typ"

#heading(level: 1, outlined: false)[Proposed Solution]
#include "000_front_matter/007_proposed_solution.typ"

#heading(level: 1, outlined: false)[Technologies Used]
#include "000_front_matter/008_technologies_used.typ"

#heading(level: 1, outlined: false)[Achieved Results]
#include "000_front_matter/009_achieved_results.typ"

#outline(title: "Table of Contents")

#outline(
  title: "List of Figures",
  target: figure.where(kind: image),
)

#set heading(numbering: "1.")

= INTRODUCTION

== Necessity of the Topic
#include "100_introduction/101_necessity_of_topic.typ"

== System Objectives
#include "100_introduction/102_system_objectives.typ"

== Research Scope and Limitations
#include "100_introduction/103_research_scope_and_limitations.typ"

== User Scope and Audience
#include "100_introduction/104_user_scope_and_audience.typ"

== Methodology
#include "100_introduction/105_methodology.typ"

== Report Structure
#include "100_introduction/106_report_structure.typ"


= THEORETICAL BASIS AND TECHNOLOGY

== Theoretical Basis
#include "200_theoretical_basis_and_technology/201_theoretical_basis.typ"

== Overview of Related Technologies
#include "200_theoretical_basis_and_technology/202_related_technologies_overview.typ"

== Rationale for Technology Selection
#include "200_theoretical_basis_and_technology/203_technology_selection_rationale.typ"


= SYSTEM REQUIREMENTS ANALYSIS

== Problem Description and Business Logic
#include "300_system_requirements_analysis/301_problem_description_and_business_logic.typ"

== Stakeholders
#include "300_system_requirements_analysis/302_stakeholders.typ"

== Functional Requirements
#include "300_system_requirements_analysis/303_functional_requirements.typ"

== Non-Functional Requirements
#include "300_system_requirements_analysis/304_non_functional_requirements.typ"

== Use Case Diagram
#include "300_system_requirements_analysis/305_use_case_diagram.typ"
#include "300_system_requirements_analysis/306_use_case_specifications.typ"


= SYSTEM DESIGN

== Overall Architecture Design
#include "400_system_design/401_overall_architecture_design.typ"

== Functional Design
#include "400_system_design/402_functional_design.typ"

== Data Design
#include "400_system_design/403_data_design.typ"






= IMPLEMENTATION AND DEPLOYMENT

== Development Environment
#include "500_implementation_and_deployment/501_development_environment.typ"

== Source Code Structure
#include "500_implementation_and_deployment/502_source_code_structure.typ"

== Implementation of Main Functions
#include "500_implementation_and_deployment/503_implementation_main_functions.typ"

== System Deployment
#include "500_implementation_and_deployment/504_system_deployment.typ"


= TESTING AND EVALUATION

== Testing Strategy
#include "600_testing_and_evaluation/601_testing_strategy.typ"

== Test Case Construction and Execution
#include "600_testing_and_evaluation/602_test_case_construction_and_execution.typ"

// == System Evaluation
// #include "600_testing_and_evaluation/603_system_evaluation.typ"


= CONCLUSION AND FUTURE DEVELOPMENT

== Conclusion
#include "700_conclusion_and_future_development/701_conclusion.typ"

== Limitations of the Project
#include "700_conclusion_and_future_development/702_limitations.typ"

== Future Development
#include "700_conclusion_and_future_development/703_future_development.typ"

= REFERENCES
#include "800_references_appendix/801_references.typ"

// = APPENDIX
// #include "800_references_appendix/802_appendix.typ"
