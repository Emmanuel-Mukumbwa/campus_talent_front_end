├── .gitignore
├── README.md
├── package-lock.json
├── package.json
├── public
    ├── index.html
    ├── logo192.png
    ├── logo512.png
    ├── manifest.json
    └── robots.txt
└── src
    ├── App.css
    ├── App.js
    ├── App.test.js
    ├── api
        └── mockAPI.js
    ├── assets
        └── images
        │   ├── IMG-20250413-WA0008.jpg
        │   ├── IMG-20250510-WA0009.jpg
        │   ├── application.jpg
        │   ├── background.jpg
        │   ├── background1.jpg
        │   ├── joblisting1.jpg
        │   ├── joblisting2.jpg
        │   ├── join-hero.jpg
        │   ├── join-hero1.jpg
        │   ├── skilladdition.jpg
        │   ├── skilladdition1.jpg
        │   └── studentdash.jpg
    ├── components
        ├── AdminNavbar.css
        ├── AdminNavbar.js
        ├── AnalyticsPanel.js
        ├── DiscoverStudents.css
        ├── DiscoverStudents.js
        ├── FiltersSidebar.js
        ├── FindJobsBySkill.css
        ├── FindJobsBySkill.js
        ├── Footer.js
        ├── GlobalNavbar.js
        ├── Modal.css
        ├── Navbar.js
        ├── NotificationsPanel.js
        ├── ProtectedRoute.js
        ├── Recommendations.js
        ├── Sidebar.js
        ├── applications
        │   ├── ApplicationsTable.js
        │   ├── InlinePreview.js
        │   ├── StatusTabs.js
        │   └── TaskChecklist.js
        ├── apply
        │   ├── ApplicationStep.js
        │   └── PortfolioStep.js
        ├── connections
        │   ├── ConnectionCard.js
        │   ├── ConnectionsGrid.js
        │   ├── ConnectionsSection.js
        │   ├── index.js
        │   └── mockSuggestedConnections.js
        ├── creategig
        │   ├── GigEscrowStep3.js
        │   ├── GigFormStep1.js
        │   ├── GigPreviewStep5.js
        │   └── GigRequirementsStep4.js
        ├── discover
        │   ├── LoadMoreButton.js
        │   ├── SearchFilters.js
        │   ├── StudentCard.js
        │   └── StudentSection.js
        ├── gigs
        │   ├── AnalyticsPanel.js
        │   ├── FiltersSidebar.js
        │   ├── GigsGrid.css
        │   ├── GigsGrid.js
        │   └── Recommendations.js
        ├── myprofile
        │   ├── ProfileForm.js
        │   └── ProfileHeader.js
        ├── navbar.css
        ├── portfoliobuilder
        │   ├── AboutStep.js
        │   ├── MediaUpload.js
        │   ├── PreviewStep.js
        │   ├── ProficiencyStep.js
        │   ├── ProjectForm.js
        │   ├── ProjectStep.js
        │   ├── SkillSelectStep.js
        │   ├── WizardNavButtons.js
        │   └── templates.js
        └── verification
        │   ├── BasicVerification.js
        │   └── BusinessVerification.js
    ├── constants
        └── programs.js
    ├── data
        ├── ApplyGigWizard.js
        ├── CreateGigWizard.js
        ├── DiscoverStudents.js
        ├── EditGigWizard.js
        ├── PortfolioBuilder.js
        ├── PortfolioView.js
        ├── ProjectStep.js
        ├── RecruiterApplications.js
        ├── gigs.js
        ├── index.js
        └── networkData.js
    ├── index.css
    ├── index.js
    ├── logo.svg
    ├── pages
        ├── ApplyGigWizard.js
        ├── Conversation.css
        ├── Conversation.js
        ├── CreateGigWizard.js
        ├── Disclaimer.js
        ├── EditGigWizard.js
        ├── EndorseWizard.css
        ├── EndorseWizard.js
        ├── EscrowCheck.js
        ├── EscrowDetail.js
        ├── FeesPage.js
        ├── GetStarted.css
        ├── GetStarted.js
        ├── GigDetail.js
        ├── Gigs.css
        ├── Gigs.js
        ├── HomePage.css
        ├── HomePage.js
        ├── LoginPage.js
        ├── Messages.css
        ├── Messages.js
        ├── MyNetwork.css
        ├── MyNetwork.js
        ├── MyProfile.css
        ├── MyProfile.js
        ├── Notifications.js
        ├── PortfolioBuilder.css
        ├── PortfolioBuilder.js
        ├── PortfolioView.css
        ├── PortfolioView.js
        ├── PostGigWizard.js
        ├── PostJobWizard.css
        ├── RecruiterApplicationDetail.js
        ├── RecruiterApplicationReview.js
        ├── RecruiterApplications.js
        ├── RecruiterGigs.js
        ├── RecruiterNetwork.js
        ├── RecruiterVerification.js
        ├── Redirecting.js
        ├── RegisterPage.css
        ├── RegisterPage.js
        ├── StudentApplicationDetail.js
        ├── StudentApplications.js
        ├── StudentGigs.js
        ├── StudentNetwork.js
        ├── SubscriptionPage.js
        ├── SubscriptionStatus.js
        ├── Terms.js
        ├── admin
        │   ├── AdminDashboard.js
        │   ├── AdminLayout.js
        │   ├── ApplicationTracking.js
        │   ├── GigManagement.js
        │   ├── ManageSubscriptions.js
        │   ├── SkillsPage.js
        │   ├── UserManagement.js
        │   ├── VerificationDetail.js
        │   └── VerificationsList.js
        └── post.js
    ├── reportWebVitals.js
    ├── services
        └── mockStudentActions.js
    ├── setupTests.js
    └── utils
        ├── api.js
        └── some.css

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
