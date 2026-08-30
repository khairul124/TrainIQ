// ============================================================
// FitnessGPT — Structured Workout Database
// Organized by Location → Split Type → Equipment
// ============================================================

export interface WorkoutExercise {
  name: string;
  sets: number;
  reps: string;          // e.g. "10-12" or "30s" or "To failure"
  restSeconds: number;
  muscleGroup: string;
  equipment: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  instructions: string[];
  tips: string;
  visual: string;        // emoji visual
  formImage?: string;    // public path to form photo
}

// ============================================================
// FORM IMAGE MAP — keyword → /public image path
// Matched in order: first keyword found in exercise name wins
// ============================================================
export const FORM_IMAGE_MAP: { keywords: string[]; image: string }[] = [
  { keywords: ['bench press', 'chest press', 'incline press', 'incline dumbbell press', 'incline barbell'], image: '/form_bench_press.png' },
  { keywords: ['squat', 'goblet squat', 'front squat', 'smith machine squat', 'bulgarian split squat'], image: '/form_squat.png' },
  { keywords: ['deadlift'], image: '/form_deadlift.png' },
  { keywords: ['push-up', 'push up', 'pushup', 'diamond push', 'pike push', 'decline push', 'incline push'], image: '/form_pushup.png' },
  { keywords: ['pull-up', 'pull up', 'pullup', 'chin-up', 'muscle-up', 'assisted pull', 'australian row', 'lat pulldown', 'hanging knee', 'hanging leg'], image: '/form_pullup.png' },
  { keywords: ['curl', 'bicep', 'hammer curl', 'concentration curl', 'cable bicep', 'barbell curl', 'preacher curl'], image: '/form_dumbbell_curl.png' },
  { keywords: ['shoulder press', 'overhead press', 'arnold press', 'overhead cable'], image: '/form_shoulder_press.png' },
  { keywords: ['plank', 'plank jack', 'mountain climber', 'l-sit', 'dead bug', 'inchworm'], image: '/form_plank.png' },
  { keywords: ['lunge', 'step-up', 'split squat', 'leg press', 'leg extension', 'leg curl', 'calf raise', 'hip thrust', 'glute', 'pistol squat', 'broad jump', 'jump squat', 'tuck jump', 'box jump'], image: '/form_lunge.png' },
];

export function getFormImage(exerciseName: string): string | null {
  const lower = exerciseName.toLowerCase();
  for (const entry of FORM_IMAGE_MAP) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return entry.image;
    }
  }
  return null;
}

export interface WorkoutRoutine {
  id: string;
  name: string;
  description: string;
  duration: number;       // minutes
  calories: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  exercises: WorkoutExercise[];
}

export interface WorkoutDay {
  dayLabel: string;       // e.g. "Day 1 — Chest"
  routines: WorkoutRoutine[];
}

export interface SplitPlan {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: string;
  color: string;
  days: WorkoutDay[];
}

export interface EquipmentVariant {
  id: string;
  label: string;
  icon: string;
  description: string;
  splits: SplitPlan[];
}

export interface LocationCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}

// ============================================================
// LOCATION CATEGORIES
// ============================================================
export const LOCATIONS: LocationCategory[] = [
  {
    id: 'home',
    name: 'Home Workout',
    description: 'No equipment needed. Train anywhere with bodyweight exercises designed for all fitness levels.',
    icon: '🏠',
    gradient: 'linear-gradient(135deg, #6C63FF 0%, #A855F7 100%)',
    bgColor: 'rgba(108,99,255,0.08)',
    borderColor: 'rgba(108,99,255,0.25)',
    features: ['No Equipment', 'Bodyweight', 'Flexible Schedule', 'All Levels'],
  },
  {
    id: 'outdoor',
    name: 'Outdoor / Park',
    description: 'Fresh air training using park benches, bars, and open spaces. Great for cardio and calisthenics.',
    icon: '🌳',
    gradient: 'linear-gradient(135deg, #00FF88 0%, #00D9FF 100%)',
    bgColor: 'rgba(0,255,136,0.06)',
    borderColor: 'rgba(0,255,136,0.25)',
    features: ['Park Equipment', 'Calisthenics', 'Cardio Focus', 'Free'],
  },
  {
    id: 'gym',
    name: 'Gym Workout',
    description: 'Full access to dumbbells, barbells, cables, and machines. Choose your split and equipment preference.',
    icon: '🏋️',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)',
    bgColor: 'rgba(255,107,107,0.06)',
    borderColor: 'rgba(255,107,107,0.25)',
    features: ['All Equipment', 'Split Programs', 'Progressive Overload', 'Maximum Results'],
  },
];

// ============================================================
// GYM SPLIT TYPE METADATA
// ============================================================
export const GYM_SPLIT_TYPES = [
  { id: 'bro_split', name: 'Bro Split', shortName: 'Bro', description: 'One muscle group per day. 5-day program.', icon: '💪', color: '#6C63FF' },
  { id: 'full_body', name: 'Full Body', shortName: 'Full', description: 'Hit every muscle group each session. 3 days/week.', icon: '🔥', color: '#FF6B6B' },
  { id: 'upper_lower', name: 'Upper / Lower', shortName: 'U/L', description: 'Alternate upper and lower body. 4 days/week.', icon: '⚡', color: '#00D9FF' },
  { id: 'ppl', name: 'Push / Pull / Legs', shortName: 'PPL', description: 'Push, pull, and legs rotation. 6 days/week.', icon: '🎯', color: '#00FF88' },
];

// ============================================================
// EQUIPMENT FILTER METADATA
// ============================================================
export const EQUIPMENT_FILTERS = [
  { id: 'dumbbell', label: 'Dumbbell Only', icon: '🏋️', description: 'Dumbbells and bodyweight only' },
  { id: 'dumbbell_barbell', label: 'Dumbbell & Barbell', icon: '🏗️', description: 'Free weights — dumbbells and barbells' },
  { id: 'machine', label: 'Machine Based', icon: '⚙️', description: 'Cable machines, smith machines, and plate-loaded' },
];

// ============================================================
// HOME WORKOUTS
// ============================================================
export const HOME_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'home-full-body',
    name: 'Full Body Burn',
    description: 'Complete bodyweight circuit for total body conditioning',
    duration: 35,
    calories: 320,
    difficulty: 'beginner',
    exercises: [
      { name: 'Jumping Jacks', sets: 3, reps: '30', restSeconds: 30, muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Stand upright with feet together', 'Jump and spread legs while raising arms overhead', 'Return to starting position'], tips: 'Keep core engaged throughout', visual: '🏃' },
      { name: 'Push-Ups', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Place hands shoulder-width apart on the floor', 'Lower chest to the ground with a straight body', 'Push back up explosively'], tips: 'Modify on knees if needed', visual: '💪' },
      { name: 'Bodyweight Squats', sets: 4, reps: '15-20', restSeconds: 45, muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down like sitting in a chair', 'Drive through heels to stand'], tips: 'Keep knees tracking over toes', visual: '🦵' },
      { name: 'Plank Hold', sets: 3, reps: '30-45s', restSeconds: 45, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Hold push-up position on forearms', 'Keep body in a straight line from head to heels', 'Engage core and squeeze glutes'], tips: 'Avoid letting hips sag or pike up', visual: '🧱' },
      { name: 'Lunges', sets: 3, reps: '10 each leg', restSeconds: 45, muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Step forward with one leg', 'Lower back knee towards ground', 'Push back to starting position'], tips: 'Keep torso upright throughout', visual: '🦿' },
      { name: 'Mountain Climbers', sets: 3, reps: '20 each side', restSeconds: 45, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Start in push-up position', 'Drive knees to chest alternately', 'Keep hips level and core tight'], tips: 'Move fast for cardio, slow for core focus', visual: '⛰️' },
    ]
  },
  {
    id: 'home-upper',
    name: 'Upper Body Sculptor',
    description: 'Target chest, back, shoulders and arms with no equipment',
    duration: 30,
    calories: 280,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Diamond Push-Ups', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Form a diamond shape with hands under chest', 'Lower chest to hands', 'Press back up'], tips: 'Great for targeting triceps', visual: '💎' },
      { name: 'Pike Push-Ups', sets: 3, reps: '8-10', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Start in downward dog position', 'Bend elbows to lower head toward floor', 'Push back up'], tips: 'Elevate feet for more difficulty', visual: '🔺' },
      { name: 'Superman Hold', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Lie face down with arms extended', 'Simultaneously lift arms, chest, and legs off floor', 'Hold briefly and lower'], tips: 'Squeeze shoulder blades together at the top', visual: '🦸' },
      { name: 'Tricep Dips (Chair)', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Place hands on edge of a sturdy chair behind you', 'Lower body by bending elbows', 'Press back up to full arm extension'], tips: 'Keep back close to chair', visual: '🪑' },
      { name: 'Inchworms', sets: 3, reps: '8', restSeconds: 45, muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Stand tall then walk hands out to push-up position', 'Perform one push-up', 'Walk hands back to feet and stand'], tips: 'Keep legs as straight as possible', visual: '🐛' },
    ]
  },
  {
    id: 'home-hiit',
    name: 'HIIT Inferno',
    description: 'High-intensity intervals for maximum fat burn in minimum time',
    duration: 25,
    calories: 380,
    difficulty: 'advanced',
    exercises: [
      { name: 'Burpees', sets: 4, reps: '10', restSeconds: 30, muscleGroup: 'Full Body', equipment: 'Bodyweight', difficulty: 'advanced', instructions: ['Drop to floor, chest touches ground', 'Push up and jump feet to hands', 'Jump explosively with arms overhead'], tips: 'Scale by removing the jump or push-up', visual: '🔥' },
      { name: 'Jump Squats', sets: 4, reps: '15', restSeconds: 30, muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Perform a regular squat', 'Explode upward into a jump', 'Land softly and repeat'], tips: 'Land quietly to protect joints', visual: '🚀' },
      { name: 'High Knees', sets: 4, reps: '30s', restSeconds: 20, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Run in place lifting knees to waist height', 'Pump arms with each stride', 'Keep core tight and posture upright'], tips: 'Speed up for more intensity', visual: '🏃' },
      { name: 'Plank Jacks', sets: 3, reps: '20', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Start in plank position', 'Jump feet out wide then back together', 'Keep hips stable'], tips: 'Like a horizontal jumping jack', visual: '⭐' },
      { name: 'Tuck Jumps', sets: 3, reps: '10', restSeconds: 45, muscleGroup: 'Legs', equipment: 'Bodyweight', difficulty: 'advanced', instructions: ['Jump as high as possible', 'Pull knees to chest at the peak', 'Land softly with bent knees'], tips: 'Focus on height, not speed', visual: '💥' },
    ]
  },
  {
    id: 'home-core',
    name: 'Core Destroyer',
    description: 'Intensive core workout for abs, obliques, and lower back',
    duration: 20,
    calories: 200,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Crunches', sets: 3, reps: '20', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Lie on back with knees bent', 'Curl shoulders off the floor', 'Squeeze abs at the top'], tips: 'Don\'t pull on your neck', visual: '🎯' },
      { name: 'Bicycle Crunches', sets: 3, reps: '15 each side', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Lie on back, hands behind head', 'Bring opposite elbow to knee', 'Alternate sides in pedaling motion'], tips: 'Slow and controlled beats fast and sloppy', visual: '🚴' },
      { name: 'Leg Raises', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Lie flat on back, legs straight', 'Raise legs to 90 degrees', 'Lower slowly without touching floor'], tips: 'Press lower back into the floor', visual: '🦵' },
      { name: 'Russian Twists', sets: 3, reps: '20 total', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'intermediate', instructions: ['Sit with knees bent, lean back slightly', 'Rotate torso side to side', 'Touch floor beside each hip'], tips: 'Hold a water bottle for extra resistance', visual: '🌀' },
      { name: 'Dead Bug', sets: 3, reps: '10 each side', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Lie on back, arms up and knees at 90°', 'Extend opposite arm and leg simultaneously', 'Return and switch sides'], tips: 'Keep lower back glued to the floor', visual: '🪲' },
    ]
  },
];

// ============================================================
// OUTDOOR / PARK WORKOUTS
// ============================================================
export const OUTDOOR_WORKOUTS: WorkoutRoutine[] = [
  {
    id: 'outdoor-calisthenics',
    name: 'Park Calisthenics',
    description: 'Use park equipment for a full calisthenics session',
    duration: 40,
    calories: 400,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Pull-Ups (Bar)', sets: 4, reps: '6-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Pull-up Bar', difficulty: 'intermediate', instructions: ['Grip the bar with palms facing away', 'Pull chin above the bar', 'Lower with control'], tips: 'Use assisted bands if needed', visual: '🫳' },
      { name: 'Bench Dips', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Park Bench', difficulty: 'beginner', instructions: ['Place hands on bench behind you', 'Lower body by bending elbows to 90°', 'Press back up'], tips: 'Extend legs further for more difficulty', visual: '🪑' },
      { name: 'Step-Ups', sets: 3, reps: '12 each leg', restSeconds: 45, muscleGroup: 'Legs', equipment: 'Park Bench', difficulty: 'beginner', instructions: ['Place one foot on bench', 'Step up driving through the heel', 'Step down with control'], tips: 'Higher step = more glute activation', visual: '⬆️' },
      { name: 'Incline Push-Ups', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Chest', equipment: 'Park Bench', difficulty: 'beginner', instructions: ['Place hands on bench in push-up position', 'Lower chest to bench', 'Push back up'], tips: 'Great for beginners building up to floor push-ups', visual: '📐' },
      { name: 'Hanging Knee Raises', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Core', equipment: 'Pull-up Bar', difficulty: 'intermediate', instructions: ['Hang from bar with arms extended', 'Raise knees to chest', 'Lower with control'], tips: 'Progress to straight leg raises', visual: '🦵' },
      { name: 'Box Jumps (Bench)', sets: 3, reps: '8-10', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Park Bench', difficulty: 'intermediate', instructions: ['Stand facing bench', 'Jump explosively onto the bench', 'Step down and repeat'], tips: 'Ensure bench is stable and secure', visual: '📦' },
    ]
  },
  {
    id: 'outdoor-cardio',
    name: 'Outdoor Cardio Blast',
    description: 'Combine running with bodyweight intervals in the park',
    duration: 35,
    calories: 450,
    difficulty: 'intermediate',
    exercises: [
      { name: 'Warm-Up Jog', sets: 1, reps: '5 min', restSeconds: 0, muscleGroup: 'Full Body', equipment: 'None', difficulty: 'beginner', instructions: ['Light jog around the park', 'Gradually increase pace', 'Loosen up all joints'], tips: 'Focus on breathing rhythm', visual: '🏃' },
      { name: 'Sprint Intervals', sets: 6, reps: '30s sprint / 30s walk', restSeconds: 30, muscleGroup: 'Legs', equipment: 'None', difficulty: 'intermediate', instructions: ['Sprint at 80-90% effort for 30 seconds', 'Walk or slow jog for 30 seconds', 'Repeat 6 times'], tips: 'Find a straight flat path', visual: '⚡' },
      { name: 'Bear Crawls', sets: 3, reps: '20m', restSeconds: 45, muscleGroup: 'Full Body', equipment: 'None', difficulty: 'intermediate', instructions: ['Get on all fours, knees off ground', 'Crawl forward moving opposite hand and foot', 'Keep hips low and core tight'], tips: 'Great on grass surface', visual: '🐻' },
      { name: 'Broad Jumps', sets: 3, reps: '8', restSeconds: 45, muscleGroup: 'Legs', equipment: 'None', difficulty: 'intermediate', instructions: ['Stand with feet shoulder-width', 'Swing arms back then explode forward', 'Land softly with bent knees'], tips: 'Measure your distance for motivation', visual: '🦘' },
      { name: 'Cool-Down Walk', sets: 1, reps: '5 min', restSeconds: 0, muscleGroup: 'Full Body', equipment: 'None', difficulty: 'beginner', instructions: ['Walk at comfortable pace', 'Perform gentle stretches', 'Focus on deep breathing'], tips: 'Don\'t skip this to aid recovery', visual: '🚶' },
    ]
  },
  {
    id: 'outdoor-strength',
    name: 'Park Strength Builder',
    description: 'Build strength using bodyweight and park fixtures',
    duration: 45,
    calories: 380,
    difficulty: 'advanced',
    exercises: [
      { name: 'Muscle-Up Progression', sets: 5, reps: '3-5', restSeconds: 120, muscleGroup: 'Full Body', equipment: 'Pull-up Bar', difficulty: 'advanced', instructions: ['Perform explosive pull-up', 'Transition above the bar', 'Press to full lockout'], tips: 'Start with explosive pull-ups if you can\'t muscle-up yet', visual: '🤸' },
      { name: 'Pistol Squats', sets: 3, reps: '5 each leg', restSeconds: 90, muscleGroup: 'Legs', equipment: 'None', difficulty: 'advanced', instructions: ['Stand on one leg', 'Lower into a deep single-leg squat', 'Press back up without assistance'], tips: 'Hold onto a post for balance at first', visual: '🎯' },
      { name: 'Decline Push-Ups', sets: 4, reps: '12', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Park Bench', difficulty: 'intermediate', instructions: ['Place feet on bench, hands on ground', 'Lower chest to the floor', 'Press back up with power'], tips: 'Targets upper chest and shoulders', visual: '💪' },
      { name: 'L-Sit Hold (Bars)', sets: 3, reps: '15-20s', restSeconds: 60, muscleGroup: 'Core', equipment: 'Parallel Bars', difficulty: 'advanced', instructions: ['Support body on parallel bars', 'Raise straight legs to 90°', 'Hold position'], tips: 'Bend knees if straight legs is too hard', visual: '🔷' },
      { name: 'Australian Rows', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'Back', equipment: 'Low Bar', difficulty: 'intermediate', instructions: ['Hang under a low bar with body straight', 'Pull chest to bar', 'Lower with control'], tips: 'Walk feet further out for more difficulty', visual: '🚣' },
    ]
  },
];

// ============================================================
// GYM WORKOUTS
// Organized by: Split → Equipment → Day → Exercises
// ============================================================

// ---------- BRO SPLIT ----------
const broSplit_dumbbell: WorkoutDay[] = [
  {
    dayLabel: 'Day 1 — Chest',
    routines: [{
      id: 'bro-db-chest', name: 'Chest Day (Dumbbell)', description: 'Isolate chest with dumbbell pressing and fly movements', duration: 45, calories: 350, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie on flat bench holding dumbbells at chest level', 'Press dumbbells up until arms are extended', 'Lower slowly to stretch the chest'], tips: 'Squeeze chest at the top of each rep', visual: '🏋️' },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Set bench to 30-45° incline', 'Press dumbbells up from upper chest', 'Lower with control'], tips: 'Targets upper chest fibers', visual: '📐' },
        { name: 'Dumbbell Fly', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie flat holding dumbbells above chest', 'Open arms wide in an arc', 'Squeeze back together at the top'], tips: 'Keep slight bend in elbows', visual: '🦅' },
        { name: 'Dumbbell Pullover', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie across bench, hold one dumbbell overhead', 'Lower behind head in arc', 'Pull back over chest'], tips: 'Great chest and serratus stretch', visual: '🌊' },
      ]
    }]
  },
  {
    dayLabel: 'Day 2 — Back',
    routines: [{
      id: 'bro-db-back', name: 'Back Day (Dumbbell)', description: 'Build a thick wide back with dumbbell rows and pulls', duration: 45, calories: 340, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge at hips, flat back', 'Row dumbbells to hip/ribcage', 'Squeeze shoulder blades together'], tips: 'Don\'t use momentum', visual: '🚣' },
        { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Place one knee and hand on bench', 'Row dumbbell to hip with other arm', 'Lower with control'], tips: 'Great for fixing imbalances', visual: '💪' },
        { name: 'Dumbbell Shrugs', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold heavy dumbbells at sides', 'Shrug shoulders straight up to ears', 'Hold at top briefly'], tips: 'Don\'t roll shoulders', visual: '🗻' },
        { name: 'Reverse Dumbbell Fly', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Bend forward at hips', 'Raise dumbbells out to sides', 'Squeeze rear delts at top'], tips: 'Use lighter weight for control', visual: '🦅' },
      ]
    }]
  },
  {
    dayLabel: 'Day 3 — Shoulders',
    routines: [{
      id: 'bro-db-shoulders', name: 'Shoulder Day (Dumbbell)', description: 'Build capped delts with pressing and isolation work', duration: 40, calories: 300, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Shoulder Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Sit or stand holding dumbbells at shoulders', 'Press overhead to full extension', 'Lower back to shoulders'], tips: 'Avoid excessive back arching', visual: '🏋️' },
        { name: 'Lateral Raises', sets: 4, reps: '12-15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Stand holding dumbbells at sides', 'Raise arms out to sides until parallel', 'Lower slowly'], tips: 'Lead with elbows, not wrists', visual: '🪶' },
        { name: 'Front Raises', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbells in front of thighs', 'Raise one or both arms to shoulder height', 'Lower with control'], tips: 'Alternate arms to reduce momentum', visual: '⬆️' },
        { name: 'Arnold Press', sets: 3, reps: '10', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Start with dumbbells at chin, palms facing you', 'Rotate palms outward as you press up', 'Reverse motion on the way down'], tips: 'Named after Arnold Schwarzenegger', visual: '🌀' },
      ]
    }]
  },
  {
    dayLabel: 'Day 4 — Arms',
    routines: [{
      id: 'bro-db-arms', name: 'Arms Day (Dumbbell)', description: 'Bicep and tricep focused session for sleeve-busting arms', duration: 40, calories: 280, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bicep Curls', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Stand holding dumbbells at sides', 'Curl up rotating palms to face ceiling', 'Lower under control'], tips: 'Keep elbows pinned to sides', visual: '💪' },
        { name: 'Hammer Curls', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbells with neutral grip (palms in)', 'Curl up keeping palms facing each other', 'Lower slowly'], tips: 'Hits brachialis for wider arms', visual: '🔨' },
        { name: 'Overhead Tricep Extension', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hold one dumbbell overhead with both hands', 'Lower behind head by bending elbows', 'Extend back to top'], tips: 'Keep elbows pointing up', visual: '🔺' },
        { name: 'Dumbbell Kickbacks', sets: 3, reps: '12 each', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Bend forward, upper arm parallel to floor', 'Extend forearm back squeezing tricep', 'Return with control'], tips: 'Keep upper arm stationary', visual: '🦵' },
        { name: 'Concentration Curls', sets: 3, reps: '10 each', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Sit and brace elbow against inner thigh', 'Curl dumbbell to shoulder', 'Squeeze bicep at top'], tips: 'Peak contraction exercise', visual: '🎯' },
      ]
    }]
  },
  {
    dayLabel: 'Day 5 — Legs',
    routines: [{
      id: 'bro-db-legs', name: 'Leg Day (Dumbbell)', description: 'Complete lower body session with dumbbells', duration: 50, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12-15', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbell at chest vertically', 'Squat deep keeping torso upright', 'Drive through heels to stand'], tips: 'Great for learning squat form', visual: '🏆' },
        { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hold dumbbells in front of thighs', 'Hinge at hips pushing them back', 'Feel hamstring stretch and return'], tips: 'Keep dumbbells close to legs', visual: '🔗' },
        { name: 'Dumbbell Lunges', sets: 3, reps: '10 each leg', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hold dumbbells at sides', 'Step forward into a lunge', 'Push back to start'], tips: 'Alternate legs or do all one side first', visual: '🦿' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbells at sides', 'Raise up on toes', 'Lower heels below platform level'], tips: 'Use a step for full range of motion', visual: '⬆️' },
        { name: 'Dumbbell Bulgarian Split Squat', sets: 3, reps: '10 each leg', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Rear foot elevated on bench', 'Hold dumbbells at sides', 'Lower into deep single leg squat'], tips: 'One of the best unilateral leg exercises', visual: '🇧🇬' },
      ]
    }]
  },
];

const broSplit_dumbbellBarbell: WorkoutDay[] = [
  {
    dayLabel: 'Day 1 — Chest',
    routines: [{
      id: 'bro-db-bb-chest', name: 'Chest Day (DB + BB)', description: 'Barbell compounds with dumbbell isolation for complete chest development', duration: 50, calories: 400, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lie on bench, grip bar slightly wider than shoulders', 'Unrack and lower bar to mid-chest', 'Press back up explosively'], tips: 'Plant feet firmly on floor', visual: '🏋️' },
        { name: 'Incline Barbell Press', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Set bench to 30° incline', 'Press barbell from upper chest', 'Control the descent'], tips: 'Grip slightly narrower than flat bench', visual: '📐' },
        { name: 'Dumbbell Fly', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie flat, arms wide with slight elbow bend', 'Open to stretch chest', 'Squeeze together at top'], tips: 'Feel the stretch in the pecs', visual: '🦅' },
        { name: 'Dumbbell Pullover', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie across bench, one dumbbell overhead', 'Lower behind head', 'Pull back over chest'], tips: 'Expand rib cage with deep breaths', visual: '🌊' },
      ]
    }]
  },
  {
    dayLabel: 'Day 2 — Back',
    routines: [{
      id: 'bro-db-bb-back', name: 'Back Day (DB + BB)', description: 'Deadlifts and rows for a powerful back', duration: 50, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Deadlift', sets: 4, reps: '6-8', restSeconds: 150, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'advanced', instructions: ['Stand over barbell, hip-width stance', 'Grip bar, flatten back, drive through legs', 'Extend hips at the top'], tips: 'The king of all lifts', visual: '👑' },
        { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge forward, grip barbell', 'Row to lower chest/upper abs', 'Squeeze shoulder blades'], tips: 'Keep core braced throughout', visual: '🚣' },
        { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['One hand and knee on bench', 'Row dumbbell to hip', 'Lower with full stretch'], tips: 'Feel the lat engage', visual: '💪' },
        { name: 'Dumbbell Shrugs', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Heavy dumbbells at sides', 'Shrug straight up', 'Hold and lower'], tips: 'Trap builder', visual: '🗻' },
      ]
    }]
  },
  {
    dayLabel: 'Day 3 — Shoulders',
    routines: [{
      id: 'bro-db-bb-shoulders', name: 'Shoulder Day (DB + BB)', description: 'Overhead pressing with isolation for 3D delts', duration: 45, calories: 320, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Overhead Press', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar at collarbone level', 'Press overhead to lockout', 'Lower back to front rack'], tips: 'Squeeze glutes for stability', visual: '🏋️' },
        { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Dumbbells at sides', 'Raise out to sides', 'Lower slowly'], tips: 'Slight forward lean hits side delts better', visual: '🪶' },
        { name: 'Barbell Upright Row', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Narrow grip on barbell', 'Pull to chin level', 'Lower with control'], tips: 'Use wide grip to protect shoulders', visual: '⬆️' },
        { name: 'Dumbbell Reverse Fly', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Bent forward at hips', 'Raise dumbbells to sides', 'Target rear delts'], tips: 'Light weight, high reps', visual: '🦅' },
      ]
    }]
  },
  {
    dayLabel: 'Day 4 — Arms',
    routines: [{
      id: 'bro-db-bb-arms', name: 'Arms Day (DB + BB)', description: 'Barbell curls and skull crushers with dumbbell finishers', duration: 45, calories: 300, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Curl', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'Biceps', equipment: 'Barbell', difficulty: 'beginner', instructions: ['Stand with barbell, shoulder-width grip', 'Curl bar to shoulders', 'Lower under control'], tips: 'No swinging!', visual: '💪' },
        { name: 'Skull Crushers', sets: 4, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lie on bench holding barbell above chest', 'Lower bar to forehead by bending elbows', 'Extend back up'], tips: 'Use EZ-curl bar for wrist comfort', visual: '💀' },
        { name: 'Hammer Curls', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Neutral grip dumbbells', 'Curl up palms facing in', 'Lower slowly'], tips: 'Builds forearms too', visual: '🔨' },
        { name: 'Close-Grip Bench Press', sets: 3, reps: '10', restSeconds: 90, muscleGroup: 'Triceps', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Narrow grip on barbell, hands inside shoulders', 'Lower to lower chest', 'Press up focusing on triceps'], tips: 'Great tricep mass builder', visual: '🏋️' },
        { name: 'Dumbbell Kickbacks', sets: 3, reps: '12 each', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Bent over, extend arm back', 'Squeeze tricep hard at top', 'Return slowly'], tips: 'Use light weight for quality contraction', visual: '🔙' },
      ]
    }]
  },
  {
    dayLabel: 'Day 5 — Legs',
    routines: [{
      id: 'bro-db-bb-legs', name: 'Leg Day (DB + BB)', description: 'Barbell squats and deadlifts with dumbbell accessories', duration: 55, calories: 500, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10', restSeconds: 150, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar on upper back, unrack', 'Squat to parallel or below', 'Drive up through heels'], tips: 'King of leg exercises', visual: '👑' },
        { name: 'Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hold barbell at hip level', 'Hinge at hips, push them back', 'Feel hamstring stretch and return'], tips: 'Keep bar close to body', visual: '🔗' },
        { name: 'Dumbbell Walking Lunges', sets: 3, reps: '12 each leg', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hold dumbbells, step forward', 'Lower into lunge', 'Step through to next lunge'], tips: 'Find a long aisle or walkway', visual: '🦿' },
        { name: 'Barbell Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Glutes', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Upper back on bench, bar across hips', 'Drive hips up to full extension', 'Squeeze glutes at top'], tips: 'Use a pad for comfort', visual: '🍑' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbells, stand on edge of step', 'Rise up on toes', 'Lower heels below step level'], tips: 'Slow and controlled', visual: '⬆️' },
      ]
    }]
  },
];

const broSplit_machine: WorkoutDay[] = [
  {
    dayLabel: 'Day 1 — Chest',
    routines: [{
      id: 'bro-mc-chest', name: 'Chest Day (Machine)', description: 'Machine-based chest workout for safe progressive overload', duration: 40, calories: 320, difficulty: 'beginner',
      exercises: [
        { name: 'Chest Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Adjust seat height so handles are at chest', 'Press forward to full extension', 'Return with control'], tips: 'Great for beginners to learn pressing pattern', visual: '🤖' },
        { name: 'Pec Deck / Fly Machine', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit with arms open on pads', 'Squeeze pads together in front', 'Open with control'], tips: 'Squeeze chest at the front', visual: '🦋' },
        { name: 'Cable Crossover', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Chest', equipment: 'Cable', difficulty: 'intermediate', instructions: ['Stand between cable stations, pulleys set high', 'Pull handles down and across body', 'Squeeze chest at center'], tips: 'Vary pulley height for different chest angles', visual: '✂️' },
        { name: 'Incline Chest Press Machine', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Use incline version of chest press', 'Press handles up and forward', 'Control return'], tips: 'Targets upper chest', visual: '📐' },
      ]
    }]
  },
  {
    dayLabel: 'Day 2 — Back',
    routines: [{
      id: 'bro-mc-back', name: 'Back Day (Machine)', description: 'Lat pulldowns, rows, and cable work for back width and thickness', duration: 45, calories: 350, difficulty: 'beginner',
      exercises: [
        { name: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Grip wide bar overhead', 'Pull bar to upper chest', 'Let bar return with control'], tips: 'Pull with elbows, not hands', visual: '⬇️' },
        { name: 'Seated Cable Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Sit with feet on platform', 'Pull handle to stomach', 'Squeeze back muscles'], tips: 'Keep chest up and proud', visual: '🚣' },
        { name: 'Assisted Pull-Up Machine', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Machine', difficulty: 'beginner', instructions: ['Set counterweight assistance level', 'Kneel on pad, grip handles', 'Pull chin above handles'], tips: 'Reduce assistance as you get stronger', visual: '📊' },
        { name: 'Cable Face Pull', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Set cable at face height with rope', 'Pull rope to face separating ends', 'Squeeze rear delts and mid back'], tips: 'Essential for shoulder health', visual: '🎯' },
      ]
    }]
  },
  {
    dayLabel: 'Day 3 — Shoulders',
    routines: [{
      id: 'bro-mc-shoulders', name: 'Shoulder Day (Machine)', description: 'Machine pressing and cables for shoulder growth', duration: 40, calories: 280, difficulty: 'beginner',
      exercises: [
        { name: 'Shoulder Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Shoulders', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit, grip handles at shoulder level', 'Press overhead to lockout', 'Lower with control'], tips: 'Adjust seat so handles start at shoulder height', visual: '🤖' },
        { name: 'Cable Lateral Raise', sets: 4, reps: '12-15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Cable', difficulty: 'beginner', instructions: ['Stand beside cable station, low pulley', 'Raise arm out to side', 'Lower slowly'], tips: 'Constant tension from cable resistance', visual: '🪶' },
        { name: 'Reverse Pec Deck', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit facing into pec deck machine', 'Open arms to squeeze rear delts', 'Return slowly'], tips: 'Same machine as pec deck, face opposite direction', visual: '🔄' },
        { name: 'Cable Front Raise', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Cable', difficulty: 'beginner', instructions: ['Face away from cable, low pulley', 'Raise handle in front to shoulder height', 'Lower with control'], tips: 'One arm at a time for focus', visual: '⬆️' },
      ]
    }]
  },
  {
    dayLabel: 'Day 4 — Arms',
    routines: [{
      id: 'bro-mc-arms', name: 'Arms Day (Machine)', description: 'Cable curls and pushdowns for arm development', duration: 40, calories: 260, difficulty: 'beginner',
      exercises: [
        { name: 'Cable Bicep Curl', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Biceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Stand facing cable station, low pulley', 'Curl bar handle to shoulders', 'Lower under tension'], tips: 'Constant tension throughout range', visual: '💪' },
        { name: 'Cable Tricep Pushdown', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Stand facing cable, high pulley with rope', 'Push handles down and apart', 'Return to 90° elbow bend'], tips: 'Keep elbows pinned to sides', visual: '⬇️' },
        { name: 'Cable Hammer Curl (Rope)', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Low pulley with rope attachment', 'Curl up maintaining neutral grip', 'Squeeze at top'], tips: 'Builds forearm and brachialis', visual: '🔨' },
        { name: 'Overhead Cable Extension', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Cable', difficulty: 'intermediate', instructions: ['Face away from cable, high pulley with rope', 'Extend arms overhead', 'Control return behind head'], tips: 'Great long head stretch', visual: '🔺' },
        { name: 'Machine Preacher Curl', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Biceps', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit at preacher curl machine', 'Curl handles up', 'Lower with control'], tips: 'Isolates biceps completely', visual: '🎯' },
      ]
    }]
  },
  {
    dayLabel: 'Day 5 — Legs',
    routines: [{
      id: 'bro-mc-legs', name: 'Leg Day (Machine)', description: 'Leg press, extensions and curls for complete leg development', duration: 50, calories: 400, difficulty: 'beginner',
      exercises: [
        { name: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit in leg press, feet shoulder-width', 'Lower platform bending knees to 90°', 'Press back up without locking knees'], tips: 'Foot placement changes muscle emphasis', visual: '🦵' },
        { name: 'Leg Extension', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Sit in machine, pad above ankles', 'Extend legs to full straight', 'Lower slowly'], tips: 'Squeeze quads at the top', visual: '🔓' },
        { name: 'Leg Curl', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Lie face down, pad behind ankles', 'Curl heels toward glutes', 'Lower with control'], tips: 'Targets hamstrings', visual: '🔒' },
        { name: 'Smith Machine Squat', sets: 3, reps: '10-12', restSeconds: 120, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Bar on back in smith machine', 'Squat to parallel', 'Drive up through heels'], tips: 'Guided bar path for safety', visual: '🤖' },
        { name: 'Calf Raise Machine', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Machine', difficulty: 'beginner', instructions: ['Position shoulders under pads', 'Rise up on toes', 'Lower slowly for full stretch'], tips: 'Pause at top and bottom', visual: '⬆️' },
      ]
    }]
  },
];

// ---------- FULL BODY SPLIT ----------
const fullBody_dumbbell: WorkoutDay[] = [
  {
    dayLabel: 'Day A — Full Body',
    routines: [{
      id: 'fb-db-a', name: 'Full Body A (Dumbbell)', description: 'Complete full body session emphasizing push movements', duration: 50, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold dumbbell at chest', 'Squat deep', 'Drive up through heels'], tips: 'Keep elbows inside knees', visual: '🏆' },
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lie flat, press dumbbells up', 'Lower to chest level', 'Press back up'], tips: 'Full range of motion', visual: '🏋️' },
        { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge forward, row to hips', 'Squeeze back', 'Lower with control'], tips: 'Keep back flat', visual: '🚣' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Press from shoulders overhead', 'Full lockout at top', 'Lower to shoulders'], tips: 'Engage core for stability', visual: '🏋️' },
        { name: 'Dumbbell Romanian Deadlift', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge at hips, dumbbells slide down thighs', 'Feel hamstring stretch', 'Return to standing'], tips: 'Slight knee bend only', visual: '🔗' },
        { name: 'Plank', sets: 3, reps: '30-45s', restSeconds: 30, muscleGroup: 'Core', equipment: 'Bodyweight', difficulty: 'beginner', instructions: ['Forearms on ground, body straight', 'Hold position', 'Breathe steadily'], tips: 'Don\'t forget core work', visual: '🧱' },
      ]
    }]
  },
  {
    dayLabel: 'Day B — Full Body',
    routines: [{
      id: 'fb-db-b', name: 'Full Body B (Dumbbell)', description: 'Complete full body session emphasizing pull movements', duration: 50, calories: 400, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Lunges', sets: 4, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Step forward with dumbbells', 'Lower back knee to ground', 'Push back to start'], tips: 'Alternate legs each rep', visual: '🦿' },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Bench at 30° incline', 'Press dumbbells up', 'Lower with control'], tips: 'Upper chest emphasis', visual: '📐' },
        { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['One arm rows on bench', 'Pull to hip', 'Lower slowly'], tips: 'Fix any imbalances', visual: '💪' },
        { name: 'Lateral Raises', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise dumbbells to sides', 'Shoulder height', 'Lower slowly'], tips: 'Lead with elbows', visual: '🪶' },
        { name: 'Dumbbell Curl', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Curl dumbbells up', 'Squeeze at top', 'Lower slowly'], tips: 'No swinging', visual: '💪' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['One dumbbell overhead', 'Lower behind head', 'Extend back up'], tips: 'Keep elbows close', visual: '🔺' },
      ]
    }]
  },
];

const fullBody_dumbbellBarbell: WorkoutDay[] = [
  {
    dayLabel: 'Day A — Full Body',
    routines: [{
      id: 'fb-dbbb-a', name: 'Full Body A (Free Weights)', description: 'Compound barbell lifts with dumbbell accessories', duration: 55, calories: 480, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10', restSeconds: 150, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar on upper back', 'Squat to depth', 'Drive up'], tips: 'The foundation of strength', visual: '👑' },
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Grip bar wide', 'Lower to chest', 'Press up'], tips: 'Keep butt on bench', visual: '🏋️' },
        { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge forward', 'Row to hips', 'Squeeze back'], tips: 'Bilateral dumbbell rows', visual: '🚣' },
        { name: 'Barbell Overhead Press', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar at collarbone', 'Press to lockout', 'Lower back'], tips: 'Stand tall and brace', visual: '🏋️' },
        { name: 'Dumbbell Romanian Deadlift', sets: 3, reps: '10', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge at hips', 'Stretch hamstrings', 'Return to standing'], tips: 'Hamstring focused', visual: '🔗' },
      ]
    }]
  },
  {
    dayLabel: 'Day B — Full Body',
    routines: [{
      id: 'fb-dbbb-b', name: 'Full Body B (Free Weights)', description: 'Deadlift focused with upper body accessories', duration: 55, calories: 460, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Deadlift', sets: 4, reps: '6-8', restSeconds: 150, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'advanced', instructions: ['Grip bar, drive through legs', 'Extend hips at top', 'Lower with control'], tips: 'Full body power', visual: '👑' },
        { name: 'Incline Dumbbell Press', sets: 4, reps: '10', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['30° incline', 'Press up', 'Lower to stretch'], tips: 'Upper chest focus', visual: '📐' },
        { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge, grip bar', 'Row to chest', 'Squeeze blades'], tips: 'Heavy rows for thickness', visual: '🚣' },
        { name: 'Dumbbell Lunges', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Step forward', 'Lower down', 'Push back'], tips: 'Unilateral leg work', visual: '🦿' },
        { name: 'Dumbbell Lateral Raises', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise to sides', 'Shoulder height', 'Lower slow'], tips: 'Side delt builder', visual: '🪶' },
      ]
    }]
  },
];

const fullBody_machine: WorkoutDay[] = [
  {
    dayLabel: 'Day A — Full Body',
    routines: [{
      id: 'fb-mc-a', name: 'Full Body A (Machine)', description: 'Complete machine circuit for total body training', duration: 50, calories: 380, difficulty: 'beginner',
      exercises: [
        { name: 'Leg Press', sets: 4, reps: '12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Feet shoulder width', 'Lower platform', 'Press back up'], tips: 'Don\'t lock knees', visual: '🦵' },
        { name: 'Chest Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press forward', 'Full extension', 'Return slowly'], tips: 'Stable pressing pattern', visual: '🤖' },
        { name: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Wide grip', 'Pull to upper chest', 'Control return'], tips: 'Squeeze lats at bottom', visual: '⬇️' },
        { name: 'Shoulder Press Machine', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press handles overhead', 'Lockout', 'Lower to start'], tips: 'Adjust seat properly', visual: '🤖' },
        { name: 'Leg Curl', sets: 3, reps: '12', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Curl heels to glutes', 'Squeeze hamstrings', 'Lower slowly'], tips: 'Hamstring isolation', visual: '🔒' },
      ]
    }]
  },
  {
    dayLabel: 'Day B — Full Body',
    routines: [{
      id: 'fb-mc-b', name: 'Full Body B (Machine)', description: 'Alternative machine circuit with different angles', duration: 50, calories: 370, difficulty: 'beginner',
      exercises: [
        { name: 'Smith Machine Squat', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Bar on back', 'Squat to parallel', 'Drive up'], tips: 'Guided movement path', visual: '🤖' },
        { name: 'Incline Chest Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Incline press handles up', 'Full extension', 'Lower back'], tips: 'Upper chest focus', visual: '📐' },
        { name: 'Seated Cable Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Pull to stomach', 'Squeeze back', 'Extend arms'], tips: 'Chest up, back engaged', visual: '🚣' },
        { name: 'Leg Extension', sets: 3, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Extend legs fully', 'Squeeze quads', 'Lower slowly'], tips: 'Quad isolation', visual: '🔓' },
        { name: 'Cable Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Push handles down', 'Full lockout', 'Return to 90°'], tips: 'Keep elbows still', visual: '⬇️' },
      ]
    }]
  },
];

// ---------- UPPER / LOWER SPLIT ----------
const upperLower_dumbbell: WorkoutDay[] = [
  {
    dayLabel: 'Upper Body Day',
    routines: [{
      id: 'ul-db-upper', name: 'Upper Body (Dumbbell)', description: 'Complete upper body session with dumbbells', duration: 50, calories: 380, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Press dumbbells from chest', 'Full lockout', 'Lower slowly'], tips: 'Chest staple', visual: '🏋️' },
        { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge forward', 'Row to hips', 'Squeeze back'], tips: 'Balance push with pull', visual: '🚣' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Press overhead', 'Full extension', 'Lower to shoulders'], tips: 'Seated or standing', visual: '🏋️' },
        { name: 'Dumbbell Curl', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Curl up', 'Squeeze', 'Lower slowly'], tips: 'Controlled reps', visual: '💪' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Dumbbell overhead', 'Lower behind head', 'Extend up'], tips: 'One or two-arm variation', visual: '🔺' },
        { name: 'Lateral Raises', sets: 3, reps: '15', restSeconds: 30, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise to sides', 'Shoulder height', 'Lower slowly'], tips: 'Light and strict', visual: '🪶' },
      ]
    }]
  },
  {
    dayLabel: 'Lower Body Day',
    routines: [{
      id: 'ul-db-lower', name: 'Lower Body (Dumbbell)', description: 'Complete lower body session with dumbbells', duration: 50, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12-15', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Hold at chest', 'Squat deep', 'Drive up'], tips: 'Stay upright', visual: '🏆' },
        { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge at hips', 'Feel stretch', 'Return'], tips: 'Hamstring focus', visual: '🔗' },
        { name: 'Dumbbell Bulgarian Split Squat', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Rear foot on bench', 'Lower into squat', 'Drive up'], tips: 'Great glute and quad builder', visual: '🇧🇬' },
        { name: 'Dumbbell Step-Ups', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Step up onto bench', 'Drive through heel', 'Step down'], tips: 'Use a sturdy bench', visual: '⬆️' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Rise on toes', 'Hold at top', 'Lower slowly'], tips: 'Full range of motion', visual: '⬆️' },
      ]
    }]
  },
];

const upperLower_dumbbellBarbell: WorkoutDay[] = [
  {
    dayLabel: 'Upper Body Day',
    routines: [{
      id: 'ul-dbbb-upper', name: 'Upper Body (Free Weights)', description: 'Barbell pressing with dumbbell accessories', duration: 55, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lower to chest', 'Press to lockout', 'Control negative'], tips: 'Compound chest builder', visual: '🏋️' },
        { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge forward', 'Row to chest', 'Squeeze blades'], tips: 'Heavy pulling', visual: '🚣' },
        { name: 'Barbell Overhead Press', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Press from rack position', 'Full overhead lockout', 'Lower back'], tips: 'The strict press', visual: '🏋️' },
        { name: 'Dumbbell Curl', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Curl up', 'Squeeze', 'Lower'], tips: 'Supinate at the top', visual: '💪' },
        { name: 'Skull Crushers', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lower bar to forehead', 'Extend up', 'Control weight'], tips: 'EZ-bar recommended', visual: '💀' },
        { name: 'Dumbbell Lateral Raises', sets: 3, reps: '15', restSeconds: 30, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise to sides', 'Shoulder height', 'Lower'], tips: 'Side delt width', visual: '🪶' },
      ]
    }]
  },
  {
    dayLabel: 'Lower Body Day',
    routines: [{
      id: 'ul-dbbb-lower', name: 'Lower Body (Free Weights)', description: 'Squat and deadlift with dumbbell accessories', duration: 55, calories: 500, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10', restSeconds: 150, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar on back', 'Squat deep', 'Drive up'], tips: 'King of legs', visual: '👑' },
        { name: 'Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge at hips', 'Bar slides down legs', 'Return to top'], tips: 'Hamstring emphasis', visual: '🔗' },
        { name: 'Dumbbell Walking Lunges', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Walk forward in lunge pattern', 'Hold dumbbells', 'Deep steps'], tips: 'Quad and glute burner', visual: '🦿' },
        { name: 'Barbell Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Glutes', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Back on bench', 'Bar on hips', 'Thrust up'], tips: 'Glute builder #1', visual: '🍑' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Rise up', 'Hold', 'Lower slowly'], tips: 'Don\'t bounce', visual: '⬆️' },
      ]
    }]
  },
];

const upperLower_machine: WorkoutDay[] = [
  {
    dayLabel: 'Upper Body Day',
    routines: [{
      id: 'ul-mc-upper', name: 'Upper Body (Machine)', description: 'Machine and cable based upper body training', duration: 45, calories: 350, difficulty: 'beginner',
      exercises: [
        { name: 'Chest Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press forward', 'Full extension', 'Return'], tips: 'Guided pressing', visual: '🤖' },
        { name: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Pull bar to chest', 'Squeeze lats', 'Control up'], tips: 'Wide grip for width', visual: '⬇️' },
        { name: 'Shoulder Press Machine', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press up', 'Lockout', 'Lower'], tips: 'Adjust seat height', visual: '🤖' },
        { name: 'Cable Bicep Curl', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Curl bar up', 'Squeeze', 'Lower'], tips: 'Constant tension', visual: '💪' },
        { name: 'Cable Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Push down', 'Full extension', 'Return'], tips: 'Rope or bar attachment', visual: '⬇️' },
      ]
    }]
  },
  {
    dayLabel: 'Lower Body Day',
    routines: [{
      id: 'ul-mc-lower', name: 'Lower Body (Machine)', description: 'Machine based lower body training for safe progressive overload', duration: 45, calories: 380, difficulty: 'beginner',
      exercises: [
        { name: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press platform', 'Full extension', 'Lower slowly'], tips: 'Don\'t lock knees', visual: '🦵' },
        { name: 'Leg Extension', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Extend legs', 'Squeeze quads', 'Lower'], tips: 'Quad isolation', visual: '🔓' },
        { name: 'Leg Curl', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Curl heels', 'Squeeze hamstrings', 'Lower'], tips: 'Hamstring isolation', visual: '🔒' },
        { name: 'Hip Abduction Machine', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Glutes', equipment: 'Machine', difficulty: 'beginner', instructions: ['Push legs outward', 'Squeeze glutes', 'Return slowly'], tips: 'Outer glutes and hips', visual: '🦵' },
        { name: 'Calf Raise Machine', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Machine', difficulty: 'beginner', instructions: ['Rise up', 'Hold', 'Lower'], tips: 'Full range of motion', visual: '⬆️' },
      ]
    }]
  },
];

// ---------- PPL (Push/Pull/Legs) ----------
const ppl_dumbbell: WorkoutDay[] = [
  {
    dayLabel: 'Push Day',
    routines: [{
      id: 'ppl-db-push', name: 'Push (Dumbbell)', description: 'Chest, shoulders, and triceps with dumbbells', duration: 45, calories: 350, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bench Press', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Press from chest', 'Full extension', 'Lower slowly'], tips: 'Main chest movement', visual: '🏋️' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['30° incline', 'Press up', 'Lower with control'], tips: 'Upper chest', visual: '📐' },
        { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Press overhead', 'Lockout', 'Lower'], tips: 'Shoulder builder', visual: '🏋️' },
        { name: 'Lateral Raises', sets: 3, reps: '15', restSeconds: 30, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise to sides', 'Control descent', 'Don\'t swing'], tips: 'Side delt width', visual: '🪶' },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Lower behind head', 'Extend up', 'Squeeze tricep'], tips: 'One dumbbell, both hands', visual: '🔺' },
      ]
    }]
  },
  {
    dayLabel: 'Pull Day',
    routines: [{
      id: 'ppl-db-pull', name: 'Pull (Dumbbell)', description: 'Back and biceps with dumbbells', duration: 45, calories: 340, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Bent-Over Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge forward', 'Row to hips', 'Squeeze back'], tips: 'Main back movement', visual: '🚣' },
        { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['One arm on bench', 'Row to hip', 'Lower slowly'], tips: 'Fix imbalances', visual: '💪' },
        { name: 'Reverse Dumbbell Fly', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Bent forward', 'Raise to sides', 'Squeeze rear delts'], tips: 'Light weight', visual: '🦅' },
        { name: 'Dumbbell Bicep Curls', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Curl up', 'Squeeze at top', 'Lower'], tips: 'Classic builder', visual: '💪' },
        { name: 'Hammer Curls', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Neutral grip', 'Curl up', 'Lower slowly'], tips: 'Brachialis focus', visual: '🔨' },
      ]
    }]
  },
  {
    dayLabel: 'Legs Day',
    routines: [{
      id: 'ppl-db-legs', name: 'Legs (Dumbbell)', description: 'Complete leg day with dumbbells', duration: 50, calories: 420, difficulty: 'intermediate',
      exercises: [
        { name: 'Dumbbell Goblet Squat', sets: 4, reps: '12-15', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Dumbbell at chest', 'Squat deep', 'Drive up'], tips: 'Stay upright', visual: '🏆' },
        { name: 'Dumbbell Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Hinge at hips', 'Stretch hamstrings', 'Return'], tips: 'Slow and controlled', visual: '🔗' },
        { name: 'Dumbbell Bulgarian Split Squat', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Rear foot elevated', 'Lower deep', 'Drive up'], tips: 'Incredible quad and glute builder', visual: '🇧🇬' },
        { name: 'Dumbbell Lunges', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Step forward', 'Lower', 'Push back'], tips: 'Walking or stationary', visual: '🦿' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Rise on toes', 'Hold', 'Lower'], tips: 'Full range', visual: '⬆️' },
      ]
    }]
  },
];

const ppl_dumbbellBarbell: WorkoutDay[] = [
  {
    dayLabel: 'Push Day',
    routines: [{
      id: 'ppl-dbbb-push', name: 'Push (Free Weights)', description: 'Barbell pressing with dumbbell isolation for pushing muscles', duration: 55, calories: 400, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Bench Press', sets: 4, reps: '8-10', restSeconds: 120, muscleGroup: 'Chest', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lower to chest', 'Press to lockout', 'Controlled negative'], tips: 'The pressing foundation', visual: '🏋️' },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['30° incline', 'Press up', 'Lower slowly'], tips: 'Upper chest emphasis', visual: '📐' },
        { name: 'Barbell Overhead Press', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Shoulders', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Press from rack position', 'Full lockout', 'Lower back'], tips: 'Strict press for shoulders', visual: '🏋️' },
        { name: 'Dumbbell Lateral Raises', sets: 3, reps: '15', restSeconds: 30, muscleGroup: 'Shoulders', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Raise to sides', 'Shoulder height', 'Lower'], tips: 'Volume for width', visual: '🪶' },
        { name: 'Skull Crushers', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Triceps', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Lower to forehead', 'Extend up', 'Control weight'], tips: 'Tricep mass builder', visual: '💀' },
        { name: 'Dumbbell Fly', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Chest', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Open wide', 'Squeeze together', 'Feel chest stretch'], tips: 'Chest finisher', visual: '🦅' },
      ]
    }]
  },
  {
    dayLabel: 'Pull Day',
    routines: [{
      id: 'ppl-dbbb-pull', name: 'Pull (Free Weights)', description: 'Deadlifts and rows for a thick powerful back', duration: 55, calories: 430, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Deadlift', sets: 4, reps: '6-8', restSeconds: 150, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'advanced', instructions: ['Drive through legs', 'Extend hips', 'Lower controlled'], tips: 'Full posterior chain', visual: '👑' },
        { name: 'Barbell Bent-Over Row', sets: 4, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge, row', 'Squeeze blades', 'Lower'], tips: 'Back thickness builder', visual: '🚣' },
        { name: 'Single-Arm Dumbbell Row', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Row to hip', 'Squeeze lat', 'Lower slowly'], tips: 'Unilateral work', visual: '💪' },
        { name: 'Barbell Curl', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Biceps', equipment: 'Barbell', difficulty: 'beginner', instructions: ['Curl bar up', 'Squeeze at top', 'Lower slowly'], tips: 'Strict form', visual: '💪' },
        { name: 'Hammer Curls', sets: 3, reps: '12', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Neutral grip', 'Curl up', 'Lower'], tips: 'Builds arm width', visual: '🔨' },
        { name: 'Dumbbell Reverse Fly', sets: 3, reps: '15', restSeconds: 30, muscleGroup: 'Back', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Bent over', 'Raise to sides', 'Squeeze rear delts'], tips: 'Rear delt health', visual: '🦅' },
      ]
    }]
  },
  {
    dayLabel: 'Legs Day',
    routines: [{
      id: 'ppl-dbbb-legs', name: 'Legs (Free Weights)', description: 'Squat-focused leg day with barbell and dumbbell work', duration: 55, calories: 500, difficulty: 'intermediate',
      exercises: [
        { name: 'Barbell Back Squat', sets: 4, reps: '8-10', restSeconds: 150, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Bar on back', 'Squat deep', 'Drive up explosively'], tips: 'Leg day staple', visual: '👑' },
        { name: 'Romanian Deadlift', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Hinge at hips', 'Feel stretch', 'Return to top'], tips: 'Hamstring focus', visual: '🔗' },
        { name: 'Dumbbell Walking Lunges', sets: 3, reps: '10 each', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Dumbbell', difficulty: 'intermediate', instructions: ['Walk and lunge', 'Deep steps', 'Keep balance'], tips: 'Functional movement', visual: '🦿' },
        { name: 'Barbell Hip Thrust', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Glutes', equipment: 'Barbell', difficulty: 'intermediate', instructions: ['Back on bench', 'Thrust up', 'Squeeze glutes'], tips: 'Best glute exercise', visual: '🍑' },
        { name: 'Dumbbell Calf Raises', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Dumbbell', difficulty: 'beginner', instructions: ['Rise on toes', 'Pause at top', 'Lower slowly'], tips: 'Don\'t skip calves', visual: '⬆️' },
      ]
    }]
  },
];

const ppl_machine: WorkoutDay[] = [
  {
    dayLabel: 'Push Day',
    routines: [{
      id: 'ppl-mc-push', name: 'Push (Machine)', description: 'Machine-based pushing workout for chest, shoulders, triceps', duration: 45, calories: 320, difficulty: 'beginner',
      exercises: [
        { name: 'Chest Press Machine', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press forward', 'Full extension', 'Return'], tips: 'Safe pressing', visual: '🤖' },
        { name: 'Incline Chest Press Machine', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Chest', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press at incline', 'Lockout', 'Lower'], tips: 'Upper chest', visual: '📐' },
        { name: 'Shoulder Press Machine', sets: 3, reps: '10-12', restSeconds: 60, muscleGroup: 'Shoulders', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press overhead', 'Control weight', 'Lower slowly'], tips: 'Strict form', visual: '🤖' },
        { name: 'Cable Lateral Raise', sets: 3, reps: '12-15', restSeconds: 30, muscleGroup: 'Shoulders', equipment: 'Cable', difficulty: 'beginner', instructions: ['Low pulley', 'Raise to side', 'Lower slowly'], tips: 'Constant tension', visual: '🪶' },
        { name: 'Cable Tricep Pushdown', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Triceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Push handles down', 'Full lockout', 'Return'], tips: 'Rope or bar', visual: '⬇️' },
      ]
    }]
  },
  {
    dayLabel: 'Pull Day',
    routines: [{
      id: 'ppl-mc-pull', name: 'Pull (Machine)', description: 'Machine and cable work for back and biceps', duration: 45, calories: 320, difficulty: 'beginner',
      exercises: [
        { name: 'Lat Pulldown', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Wide grip', 'Pull to chest', 'Control return'], tips: 'Squeeze lats', visual: '⬇️' },
        { name: 'Seated Cable Row', sets: 4, reps: '10-12', restSeconds: 90, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Pull to stomach', 'Squeeze back', 'Extend'], tips: 'Back thickness', visual: '🚣' },
        { name: 'Assisted Pull-Up Machine', sets: 3, reps: '8-10', restSeconds: 90, muscleGroup: 'Back', equipment: 'Machine', difficulty: 'beginner', instructions: ['Use assistance', 'Pull chin up', 'Lower slowly'], tips: 'Build to unassisted', visual: '📊' },
        { name: 'Cable Face Pull', sets: 3, reps: '15', restSeconds: 45, muscleGroup: 'Back', equipment: 'Cable', difficulty: 'beginner', instructions: ['Pull to face', 'Separate rope', 'Squeeze'], tips: 'Shoulder health must', visual: '🎯' },
        { name: 'Cable Bicep Curl', sets: 3, reps: '12-15', restSeconds: 45, muscleGroup: 'Biceps', equipment: 'Cable', difficulty: 'beginner', instructions: ['Curl up', 'Squeeze', 'Lower'], tips: 'Constant cable tension', visual: '💪' },
      ]
    }]
  },
  {
    dayLabel: 'Legs Day',
    routines: [{
      id: 'ppl-mc-legs', name: 'Legs (Machine)', description: 'Complete machine leg training for quads, hams, and calves', duration: 50, calories: 400, difficulty: 'beginner',
      exercises: [
        { name: 'Leg Press', sets: 4, reps: '10-12', restSeconds: 120, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Press platform', 'Don\'t lock knees', 'Lower slowly'], tips: 'Foot position matters', visual: '🦵' },
        { name: 'Leg Extension', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Extend fully', 'Squeeze quads', 'Lower'], tips: 'Quad isolation', visual: '🔓' },
        { name: 'Leg Curl', sets: 4, reps: '12-15', restSeconds: 60, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Curl heels', 'Squeeze hamstrings', 'Lower'], tips: 'Hamstring builder', visual: '🔒' },
        { name: 'Smith Machine Squat', sets: 3, reps: '10-12', restSeconds: 90, muscleGroup: 'Legs', equipment: 'Machine', difficulty: 'beginner', instructions: ['Bar on back', 'Squat to depth', 'Drive up'], tips: 'Guided squat path', visual: '🤖' },
        { name: 'Calf Raise Machine', sets: 4, reps: '15-20', restSeconds: 30, muscleGroup: 'Calves', equipment: 'Machine', difficulty: 'beginner', instructions: ['Rise up', 'Pause', 'Lower'], tips: 'Full range of motion', visual: '⬆️' },
      ]
    }]
  },
];

// ============================================================
// GYM DATA: Map split × equipment → workout days
// ============================================================
export interface GymDataEntry {
  splitId: string;
  equipmentId: string;
  days: WorkoutDay[];
}

export const GYM_WORKOUT_DATA: GymDataEntry[] = [
  // Bro Split
  { splitId: 'bro_split', equipmentId: 'dumbbell', days: broSplit_dumbbell },
  { splitId: 'bro_split', equipmentId: 'dumbbell_barbell', days: broSplit_dumbbellBarbell },
  { splitId: 'bro_split', equipmentId: 'machine', days: broSplit_machine },
  // Full Body
  { splitId: 'full_body', equipmentId: 'dumbbell', days: fullBody_dumbbell },
  { splitId: 'full_body', equipmentId: 'dumbbell_barbell', days: fullBody_dumbbellBarbell },
  { splitId: 'full_body', equipmentId: 'machine', days: fullBody_machine },
  // Upper/Lower
  { splitId: 'upper_lower', equipmentId: 'dumbbell', days: upperLower_dumbbell },
  { splitId: 'upper_lower', equipmentId: 'dumbbell_barbell', days: upperLower_dumbbellBarbell },
  { splitId: 'upper_lower', equipmentId: 'machine', days: upperLower_machine },
  // PPL
  { splitId: 'ppl', equipmentId: 'dumbbell', days: ppl_dumbbell },
  { splitId: 'ppl', equipmentId: 'dumbbell_barbell', days: ppl_dumbbellBarbell },
  { splitId: 'ppl', equipmentId: 'machine', days: ppl_machine },
];

/**
 * Returns a deduplicated master list of all exercises across Gym, Home, and Outdoor datasets.
 */
export function getAllExercises(): WorkoutExercise[] {
  const map = new Map<string, WorkoutExercise>();

  // Helper to add
  const addEx = (ex: WorkoutExercise) => {
    if (!map.has(ex.name)) {
      map.set(ex.name, ex);
    }
  };

  // Gym
  GYM_WORKOUT_DATA.forEach(entry => {
    entry.days.forEach(day => {
      day.routines.forEach(routine => {
        routine.exercises.forEach(addEx);
      });
    });
  });

  // Home
  HOME_WORKOUTS.forEach(r => r.exercises.forEach(addEx));

  // Outdoor
  OUTDOOR_WORKOUTS.forEach(r => r.exercises.forEach(addEx));

  return Array.from(map.values());
}

