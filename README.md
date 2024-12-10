# Sky - Personalized Yoga Practice App

## Project Overview
Sky is a mobile application built with Expo and React Native, focusing on delivering personalized yoga experiences. The app features an intelligent onboarding process that takes into account user preferences, physical conditions, and experience levels to provide a tailored yoga practice experience.

## Technical Stack
- **Frontend Framework**: React Native + Expo
- **State Management**: React Context (OnboardingContext)
- **Styling**: NativeWind (Tailwind CSS)
- **Navigation**: Expo Router
- **Storage**: AsyncStorage
- **UI Components**: Custom components with Tailwind styling
- **Animations**: React Native Reanimated

## Current Development Stage

### Functional Components/Features

#### Project Setup & Configuration
- ✅ Expo with React Native
- ✅ NativeWind (Tailwind CSS for React Native)
- ✅ Type safety (TypeScript)
- ✅ Basic navigation structure using expo-router
- ✅ Basic performance monitoring
- ✅ Context management

#### Onboarding Flow
- ✅ Welcome screen
- ✅ Name input screen
- ✅ Focus selection screen
- ✅ Injury check screen
- ✅ Injury area selection with body map
- ✅ Injury summary screen

### Semi-Functional Components
- 🟡 Experience screen (exists but empty)
- 🟡 Data persistence (AsyncStorage setup exists)
- 🟡 Performance monitoring (basic setup)
- 🟡 UI components (defined but need styling refinement)
- 🟡 Navigation guards and flow control

### Non-Functional/Missing Components
- ❌ Main app screens post-onboarding
- ❌ User settings
- ❌ Progress tracking
- ❌ Yoga content/poses
- ❌ Profile management
- ❌ Data validation layers
- ❌ Error boundaries
- ❌ Loading states
- ❌ Network state management
- ❌ Deep linking configuration
- ❌ Accessibility features

## Phase 1 Focus: Navigation Structure
The current phase focuses on implementing the basic navigation structure with mock data, without server connections. For completing Phase 1, the following components need to be addressed:

1. Experience Screen Implementation
   - Complete the UI design
   - Add mock data for experience levels
   - Implement selection functionality

2. Main App Navigation
   - Set up tab navigation
   - Create placeholder screens
   - Implement navigation flow from onboarding

3. Navigation Guards
   - Onboarding completion check
   - Route protection
   - Navigation state persistence

4. Mock Data Integration
   - Create mock data structures
   - Implement data providers
   - Set up temporary storage solutions

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio/Emulator (for Android development)

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
pnpm install

# Start the development server
pnpm start
```

### Running the App
```bash
# iOS
pnpm ios

# Android
pnpm android

# Web
pnpm web
```

## Project Structure
```
.
├── app/                    # Main application screens
│   ├── onboarding/        # Onboarding flow screens
│   └── (app)/             # Main app screens
├── components/            # Reusable components
├── contexts/             # React contexts
├── hooks/                # Custom hooks
├── lib/                  # Utility functions
├── services/            # Service layers
└── types/               # TypeScript type definitions
```

## Contributing


## License

## Contact
