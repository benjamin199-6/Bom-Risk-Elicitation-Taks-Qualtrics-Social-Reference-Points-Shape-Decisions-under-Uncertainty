# BERT_SRP_Task

This code allows the implementation of the Bomb Risk Elicitation Task (BRET), as proposed by Crosetto/Filippin (2013), Journal of Risk and Uncertainty (47): 31-65, as a Qualtrics application under both risk and uncertainty.

## Description

This implementation sets up the BRET in Qualtrics using HTML and JavaScript, enabling participants to interact with a matrix of clickable boxes, some of which hide bombs. Participants can click on boxes to accumulate potential earnings, but if they click on a bomb, they lose the earnings for that round. The task can be configured to operate under risk (where the probability of each outcome is known) or ambiguity (where the probability is unknown).

Additionally, for rounds under ambiguity, participants are required to complete a belief elicitation task where they estimate the number of bombs hidden in the matrix. This is done by assigning percentage points to three alternatives (0, 1, or 2 bombs) to reflect their beliefs about the likelihood of each alternative.

## How to Implement the Task in Qualtrics

### Step 1: Create a New Survey
1. Log in to your Qualtrics account.
2. Create a new survey.

### Step 2: Add a New Question
1. Add a new **Descriptive Text** question to your survey.
2. Switch to the **HTML View** by clicking the "<>" icon on the rich content editor.

### Step 3: Insert the HTML Code
1. Copy and paste the provided HTML code into the HTML editor.

### Step 4: Add the JavaScript Code
1. Click on the **Advanced Question Options** (gear icon) on the question you just added.
2. Select **Add JavaScript**.
3. Copy and paste the provided JavaScript code into the JavaScript editor.
4. Click **Save**.

### Step 5: Customize Labels and Messages (Optional)
1. Modify the variables in the JavaScript code to customize labels and messages according to your requirements (e.g., `label_collect`, `label_balance`, etc.).

### Step 6: Set Up Embedded Data
1. Go to the **Survey Flow** section of your survey.
2. Click on **Add a New Element Here** and select **Embedded Data**.
3. Add the following Embedded Data fields:
    - `risk`
    - `highAmountOfMoney`
    - `totalBoxesClickedArr`
    - `bombsClickedArr`
    - `nBombsArr`
    - `total_win`
    - `payoutRoundOneBasedIndex`
    - `beliefArr`

### Step 7: Preview and Publish
1. Preview your survey to ensure the task is functioning as expected.
2. Make any necessary adjustments.
3. Once everything looks good, publish your survey.

## Screenshots

### BRET Task Implementation in Qualtrics

![BRET Task Implementation](https://github.com/benjamin199-6/BERT_SRP_Task/assets/72379630/4cc1fcc0-7a7b-4f68-8387-9da0789559c9)

### Belief Elicitation for Ambiguity

![Belief Elicitation for Ambiguity](https://github.com/benjamin199-6/BERT_SRP_Task/assets/72379630/b3d83f71-65da-402b-9fdc-45b136a757a8)
