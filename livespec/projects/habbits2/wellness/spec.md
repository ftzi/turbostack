# Wellness Tracking [HAB.wellness]

Collection of wellness tracking features for comprehensive health and habit monitoring.

## Entry Points

| Route | Feature | Description |
|-------|---------|-------------|
| `/health` | [HAB.wellness.health] | Overall health and wellness monitoring |
| `/sleep` | [HAB.wellness.sleep] | Sleep tracking and analysis |
| `/physical` | [HAB.wellness.physical] | Physical activity and exercise tracking |
| `/nutrition` | [HAB.wellness.nutrition] | Nutrition and diet tracking |
| `/mind` | [HAB.wellness.mind] | Mental wellness and mindfulness |
| `/mindset` | [HAB.wellness.mindset] | Mindset and mental frameworks |
| `/self-esteem` | [HAB.wellness.self-esteem] | Self-esteem and confidence building |
| `/personal-care` | [HAB.wellness.personal-care] | Personal care routines and habits |
| `/social` | [HAB.wellness.social] | Social connections and relationships |
| `/pets` | [HAB.wellness.pets] | Pet care tracking |
| `/groceries` | [HAB.wellness.groceries] | Grocery shopping and meal planning |
| `/purchases` | [HAB.wellness.purchases] | Purchase tracking for spending awareness |

## UI

All wellness pages currently follow the same placeholder pattern:
- Dashboard page layout
- Centered icon specific to feature
- "Coming soon" message
- Authentication required

---

## Health Tracking [HAB.wellness.health]

Monitor overall health and wellness metrics.

### Scenario: Placeholder display [HAB.wellness.health.placeholder]

- WHEN user navigates to /health
- THEN displays "Health tracking coming soon" message
- AND shows Stethoscope icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.health.future]

Future implementation will include:
- Vital signs tracking (weight, blood pressure, heart rate)
- Medication reminders
- Symptom logging
- Doctor appointment tracking
- Health goal integration

---

## Sleep Tracking [HAB.wellness.sleep]

Track and analyze sleep patterns.

### Scenario: Placeholder display [HAB.wellness.sleep.placeholder]

- WHEN user navigates to /sleep
- THEN displays "Sleep tracking coming soon" message
- AND shows sleep-related icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.sleep.future]

Future implementation will include:
- Sleep duration tracking
- Sleep quality ratings
- Bedtime and wake time logging
- Sleep patterns and trends
- Sleep goal setting

---

## Physical Activity [HAB.wellness.physical]

Track physical activity and exercise.

### Scenario: Placeholder display [HAB.wellness.physical.placeholder]

- WHEN user navigates to /physical
- THEN displays "Physical activity tracking coming soon" message
- AND shows activity-related icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.physical.future]

Future implementation will include:
- Workout logging
- Exercise types and duration
- Activity goals and streaks
- Progress tracking
- Integration with fitness apps

---

## Nutrition Tracking [HAB.wellness.nutrition]

Track nutrition and dietary habits.

### Scenario: Placeholder display [HAB.wellness.nutrition.placeholder]

- WHEN user navigates to /nutrition
- THEN displays "Nutrition tracking coming soon" message
- AND shows Apple icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.nutrition.future]

Future implementation will include:
- Meal logging
- Calorie and macro tracking
- Water intake monitoring
- Nutrition goals
- Diet patterns and insights

---

## Mind Wellness [HAB.wellness.mind]

Mental wellness and mindfulness tracking.

### Scenario: Placeholder display [HAB.wellness.mind.placeholder]

- WHEN user navigates to /mind
- THEN displays "Mind wellness coming soon" message
- AND shows Zap icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.mind.future]

Future implementation will include:
- Meditation tracking
- Mindfulness practices
- Mental clarity ratings
- Stress management
- Mind-body connection insights

---

## Mindset Development [HAB.wellness.mindset]

Mindset and mental framework development.

### Scenario: Placeholder display [HAB.wellness.mindset.placeholder]

- WHEN user navigates to /mindset
- THEN displays "Mindset tracking coming soon" message
- AND shows Brain icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.mindset.future]

Future implementation will include:
- Growth mindset tracking
- Positive thinking patterns
- Cognitive reframing exercises
- Mental model development
- Thought pattern insights

---

## Self-Esteem Building [HAB.wellness.self-esteem]

Self-esteem and confidence tracking.

### Scenario: Placeholder display [HAB.wellness.self-esteem.placeholder]

- WHEN user navigates to /self-esteem
- THEN displays "Self-esteem tracking coming soon" message
- AND shows Heart icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.self-esteem.future]

Future implementation will include:
- Confidence level tracking
- Affirmations and positive self-talk
- Achievement celebration
- Self-compassion exercises
- Progress recognition

---

## Personal Care [HAB.wellness.personal-care]

Track personal care routines and habits.

### Scenario: Placeholder display [HAB.wellness.personal-care.placeholder]

- WHEN user navigates to /personal-care
- THEN displays "Personal care tracking coming soon" message
- AND shows Scissors icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.personal-care.future]

Future implementation will include:
- Morning/evening routine tracking
- Skincare routines
- Grooming habits
- Self-care activities
- Habit streaks

---

## Social Connections [HAB.wellness.social]

Track social interactions and relationships.

### Scenario: Placeholder display [HAB.wellness.social.placeholder]

- WHEN user navigates to /social
- THEN displays "Social tracking coming soon" message
- AND shows Users icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.social.future]

Future implementation will include:
- Social interaction logging
- Relationship quality tracking
- Connection goals
- Social energy levels
- Communication patterns

---

## Pet Care [HAB.wellness.pets]

Track pet care activities and schedules.

### Scenario: Placeholder display [HAB.wellness.pets.placeholder]

- WHEN user navigates to /pets
- THEN displays "Pet care tracking coming soon" message
- AND shows PawPrint icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.pets.future]

Future implementation will include:
- Pet profiles
- Feeding schedules
- Vet appointments
- Medication reminders
- Activity tracking

---

## Grocery Shopping [HAB.wellness.groceries]

Track grocery shopping and meal planning.

### Scenario: Placeholder display [HAB.wellness.groceries.placeholder]

- WHEN user navigates to /groceries
- THEN displays "Grocery tracking coming soon" message
- AND shows ShoppingCart icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.groceries.future]

Future implementation will include:
- Shopping lists
- Meal planning
- Pantry inventory
- Recipe management
- Budget tracking for groceries

---

## Purchase Tracking [HAB.wellness.purchases]

Track spending for financial awareness.

### Scenario: Placeholder display [HAB.wellness.purchases.placeholder]

- WHEN user navigates to /purchases
- THEN displays "Purchase tracking coming soon" message
- AND shows purchase-related icon
- AND uses dashboard layout

### Scenario: Future features [HAB.wellness.purchases.future]

Future implementation will include:
- Purchase logging
- Spending categories
- Budget tracking
- Purchase trends and insights
- Financial goal integration

---

## Common Placeholder Behavior [HAB.wellness.common]

All wellness pages share common placeholder characteristics.

### Scenario: Authenticated access [HAB.wellness.common.auth]

- WHEN unauthenticated user tries to access wellness page
- THEN redirects to sign-in
- AND preserves return URL

### Scenario: Consistent layout [HAB.wellness.common.layout]

- WHEN viewing any wellness placeholder page
- THEN uses DashboardPage layout component
- AND displays centered content
- AND follows theme (light/dark mode)

### Scenario: Responsive design [HAB.wellness.common.responsive]

- WHEN viewing on any device size
- THEN placeholder displays correctly
- AND layout remains centered and readable
