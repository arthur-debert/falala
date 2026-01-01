FalaLa

  Falala is a mobile application design to allow people with verbal communication issues (either temporary, permanet or developmental) to express themselves, and, in some cases to enable vocalization learning. It presents a nested structured where with two or tree levels at the most, the user can select, though big buttons, with matching drawings visual what they want to communicate. For example, the first level can have a mouth (hungry), the second several foods (say an apple). The user selects from the first category, which shows the avaliable food options, where he will click the large apple drawing. The screen will show the entire sentence (I'd like to eat an apple) in text, with the sequence of drawings and also use text to speach to vocalize the sound. 

  At it's core the app allows users to express simple frases such as  "I'm hungry" or "I'd like to drink <juice, milk, water>" or "My <body part> is hurting".
  It can be used as a temporary comunication tool, for example , as someone comes out of a medical condition where speach is impared and motor skills are not controled enough for writing. 

  Autistic children will use it to communicate needs and wants, and also train vocalization , as choices will playback the spoken text. The combination of written text, pictures and sound allows for people with different deficits to both have a communication channel that is easy to use, but also one that fosters traning on vocal and written acquisition, as the presence of multiple media facilitates linking words, pictures and related sounds.  

  The screenstate is mostly occupied by the word / phrase buttons themselves, as they need to be large as to be usable with coarser motor skills and sensitivity to stimuli overload.
  The experience has to avoid significant scrolling, keeping choices visible and discoverable. Like wise, deep nesting is to be avoided as navigating category levels is a task with significant abstraction capabilities, often missing in our public audience. 
  At all times a home / rest button is display, saving users the need to larn navigation paths and other unhelpful ideas for their needs. Additionally a configuration button (understated) allow parents, caregivers or signifacnt others to do simple costumization, mostly for the voice, visuals, contrast and the like.
  
  It's a hard requirement that the application opens ready fo the first category to be selected, and phrases are to be done with 2 or 3 clicks at the most.
  No alerts, prompts, logins, promotion or any other kind of distractions are to get in the way of the core use case: expressing a simple phrase without speaking it. 

  The application has to be perfectly functional without an internet connection, as users will often be with impaired or unavailable service. Likewise, network loading is unaceptable: the app must provide feedback instantly, a key feature for several conditions.

  There is no platform consistence requirement, but there is consistency for the app itself in the various platforms. For example, if a mother uses an iPhone and the father an Android, we want the experience to be the same, so that their child can leverage familiarity and decrease emotional disconformt and no new learning curve.


  The application must be i18n from the start, so to be useful in many languages. For the text (message strings), internacionalization is trivial. For text to speech, less common langugages provide a challenge, but we should still allow for no text to speach and a broad set of languages.

Techincal Design

  The application is to be developed with web tecnologies, which allows us to deploy to desktop apps, sites and other platforms for cases where mobile phones are not available or installation can't be easily done, which a website can solve.  Its okay if it compiles to navite code / widget (as in ReactNative or similar platforms), but the development experince must be web based with real time feedback. 

  Since fine and subtle usability issues are critical, we will develop an engine that can load an applications definitions at run times. These definitions include: 
    - UI and Ux parameters, such as button sized, illustration styles, color / contrats and text to speech voices. 
    - The phrasal graph itself, with the nested categories that make up sentences.


  This allows us to quickly iterate and test with users, and in the future maybe allow several of these packs to be changed at runtime according to user specifics (temporarely impaired adults vs autistic children, etc). 

  The application is Open Source and MIT licensed, allowing for reuse, modification and distribution with no restrictions what-so-ever. 
  The graphics should be vector graphics in order to keep the application disk size small, which is handy for under priviledge users who may lack fast internet speeds or phones with large storage. Underpriviledge users are a major part of the target userbase. 


Interface

The interface has: 

- A small title bar, where the app logo, the home / reset button are shown.   To the right side a button to mute/unmute and a settings icon are present.
- A view where the buttons for words/categories are shown visually in a grid, with both visual and written represntations.
- On click , there should be clear visual (flash), auditory (thin click sound) and haptic feedback. (the latter two are enabled / disabled through the app settings.)
- Follwing a button selection: 
  - If aa full sentence is formed , the full sentence is display: 
    - Graphicaly (the first button image an arrow and the following button images.)
    - Textually: the sentence is displayd in large letters.
    - Auditory: the text to spech enginre will read the sentece. As the sentence is read we may display accents in the current graphic and words being said.
  - The setting button must be pressed for a long time interval before opening the configuration panel, as that may consfuse a core set of users and is irrelevant to them. This prevents accidental triggering. 
  - When open, the settings panel, the same home button is present so that the learned skill to reset is reused. The config has to have a "reset config" button so that exploratory children changtes can be usually reverted to a familar state.


  Stack:
    - **Language**: TypeScript
    - **Framework**: React (using Vite for build/dev)
    - **Mobile Runtime**: Capacitor (compiles web app to Native iOS/Android)
    - **State Management**: Zustand (lightweight global store)
    - **Storage**: localforage (abstraction over IndexedDB/Native Storage)
    - **Styling**: Standard CSS / CSS Modules (no heavy UI libraries)

  Text to Speech (TTS) Strategy:
    - **Primary Engine**: @capacitor-community/text-to-speech.
      - Leverages the device's native OS TTS (Siri/AVSpeechSynthesizer on iOS, Google Speech on Android).
      - Zero download size, works offline, native performance.
    - **Consistency Option**: Piper TTS (WASM).
      - Optional download (~10MB WASM + ~20MB Voice Model) for users demanding specific cross-platform voice consistency.
      - Allows granular control over pitch/speed if OS voices are insufficient.


The Data Model

  The engine will load the application definition from YAML files. This format is chosen to be effectively "no-code" for configuration, allowing parents, therapists, and non-technical users to experiment and customize the app without rebuilding.

  Configuration Files:
    - `application.yaml`: Defines global UI/UX parameters (colors, default voice settings, behavior).
    - `lexicon.yaml`: Defines the core phrase tree and vocabulary.
    - `translations.yaml`: Defines the map of keys to localized strings.

  Data Model Structure (`lexicon.yaml`):

  ```yaml
  phrases:
    hungry:                # Key used for i18n lookup
      icon: hungry.svg     # Path to vector asset
      bg_color: "#FF5733"  # Optional override
      children: 
        apple: 
          icon: apple.svg 
          full_sentence: "request_apple_sentence" # i18n key for the full sentence
  ```

  Translation Model (`translations.yaml`):
  
  ```yaml
  en:
    hungry: "I am hungry"
    apple: "Apple"
    request_apple_sentence: "I would like to eat an apple"
  es:
    hungry: "Tengo hambre"
    apple: "Manzana"
    request_apple_sentence: "Quiero comer una manzana"
  ```
  
  Logic:
  - **Navigation**: The app starts at the root of `phrases`. Selecting a node with `children` descends into that category.
  - **Leaf Nodes**: Selecting a node without `children` triggers the "Speak" action.
  - **Display**: The label shown ensures the node's key (e.g., `apple`) is looked up in `translations.yaml` for the current locale. If missing, it falls back to the key itself or a `default_label` if provided.
  - **Speech**: When a leaf is selected, the engine looks up the `full_sentence` key. If found, that specific phrase is spoken. If `full_sentence` is omitted, the engine constructs a sentence by concatenating the path (e.g., "Hungry Apple"), though this is discouraged for learning purposes.
