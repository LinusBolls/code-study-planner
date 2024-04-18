eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJja3NuNjZ1d2w0NzUwMHdsY3JwZzk0dG9rIiwidG9rZW5WZXJzaW9uIjoxLCJpYXQiOjE3MTMyNjI1NjAsImV4cCI6MTcxNDQ3MjE2MCwiYXVkIjoiY29kZXJzIiwiaXNzIjoiY29kZS1pbnRyYW5ldCJ9.2oEDJru7JSSY8prft_VGC9_sI9_IuPzY-Uaf5SYgd1I

drag and drop ux

- empty text
- border and text for not draggable because early assessment

tokens are valid for two weeks

- module meta (recommendedPrerequisites, requiredPrerequisites, compulsoryElectivePairing)

design consideration: the suggestions are not module focused, but user focused

https://c4model.com

dependency inversion

visitor design pattern

kommentare für module

todos

- cache proxy responses

- show amount of attempts

- hook up "add item" buttons
  - should open a mini modules search?

must have

- hook up "add item" buttons
- show num attempts on items
- module popover
- advanced search filters
- generate suggestions
- calculate bachelor's grade

- improve performance

- verify module search results

- login copywriting

todo

- virtualize modules list

- improve dnd performance, fix glitches

- generate suggestions

- show module handbook info somewhere

polish

- anchor for semester list
- make modules in ects tab hoverable, include computed bachelor grade
- better disabled feedback for items
- profile page, sign out
- settings page

ects tab
todo: filter out capstone, thesis / implement capstone, thesis

(todo: red / green validation)
(todo: pull maximum required from endpoint)
(todo: hover effects)

module items

- style: make into rounded lists
- style: handle overflow
- popover
  - all assessments, feedback
  - prerequisites

search filters

- ects ✅
- orientation semester / core semester
- mandatory / compulsory elective / elective
- alternative assessment / early assessment
- requires project
- passed / failed / attempted
- grade, level

- keyboard shortcut for search bar (clear?)

- welche module man gut mit einem projekt gemeinsam nehmen kann

implement search filters

implement number of attempts, module popover info

global coundown header (End of standard/early/alternative assessment registration)

- todo: add userId to semesterModules
  - todo: unique on semesterId + category + index + userId
- todo: proper error handling, make sure everything is scoped to user

- todo: execute mutation onDragEnd
- todo: fix code university import

- refactor: add login method to client
- refactor: rename useChatSelection
