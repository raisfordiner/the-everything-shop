#set page(margin: 1.75in)
#set par(leading: 0.55em, spacing: 0.55em, first-line-indent: 1.8em, justify: true)
#show heading: set block(above: 1.4em, below: 1em)
#set text(font: "New Computer Modern")

// only first level headings on a new page
#show heading.where(level: 1): it => {
  pagebreak(weak: true)
  it
}

#include "cover_page.typ"


= Declaration of Authorship
#include "declaration_of_authorship.typ"

= Acknowledgments
#include "acknowledgments.typ"

#show outline.entry.where(
  level: 1,
): set block(above: 1.2em)

#outline(title: "Table of Contents")

#outline(
  title: "List of Figures",
  target: figure.where(kind: image),
)

= Abstract
#include "abstract.typ"

= Problem Statement
#include "problem_statement.typ"

= System Objectives
#include "system_objectives_summary.typ"

= Proposed Solution
#include "proposed_solution.typ"

= Technologies Used
#include "technologies_used.typ"

= Achieved Results
#include "achieved_results.typ"

#set heading(numbering: "1.")

= INTRODUCTION

== Necessity of the Topic
#include "necessity_of_topic.typ"

== System Objectives
#include "system_objectives.typ"

== Research Scope and Limitations
#include "research_scope_and_limitations.typ"

== User Scope and Audience
#include "user_scope_and_audience.typ"

== Methodology
#include "methodology.typ"

== Report Structure
#include "report_structure.typ"


= THEORETICAL BASIS AND TECHNOLOGY

== Theoretical Basis
#include "theoretical_basis.typ"

== Overview of Related Technologies
#include "related_technologies_overview.typ"

== Rationale for Technology Selection
#include "technology_selection_rationale.typ"


= SYSTEM REQUIREMENTS ANALYSIS

== Problem Description and Business Logic
#include "problem_description_and_business_logic.typ"

== Stakeholders
#include "stakeholders.typ"

== Functional Requirements
#include "functional_requirements.typ"

== Non-Functional Requirements
#include "non_functional_requirements.typ"

== Use Case Diagram
#include "use_case_diagram.typ"


= SYSTEM DESIGN

== Overall Architecture Design
#include "overall_architecture_design.typ"

== Functional Design
#include "functional_design.typ"

== Data Design
#include "data_design.typ"

== Detailed Module Design
#include "module_detailed_design.typ"

== User Interface Design (if any)
#include "ui_design.typ"


= IMPLEMENTATION AND DEPLOYMENT

== Development Environment
#include "development_environment.typ"

== Source Code Structure
#include "source_code_structure.typ"

== Implementation of Main Functions
#include "implementation_main_functions.typ"

== System Deployment
#include "system_deployment.typ"


= TESTING AND EVALUATION

== Testing Strategy
#include "testing_strategy.typ"

== Test Case Construction and Execution
#include "test_case_construction_and_execution.typ"

== System Evaluation
#include "system_evaluation.typ"


= CONCLUSION AND FUTURE DEVELOPMENT

== Conclusion
#include "conclusion.typ"

== Limitations of the Project
#include "limitations.typ"

== Future Development
#include "future_development.typ"

= REFERENCES
#include "references.typ"

= APPENDIX
#include "appendix.typ"
