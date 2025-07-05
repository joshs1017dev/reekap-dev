export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-passcode');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Validate passcode
    const passcode = req.headers['x-passcode'];
    if (passcode !== process.env.SINGLE_PASSCODE) {
        res.status(401).json({ error: 'Invalid passcode' });
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const {
            requirements,
            testTypes,
            includeTestData,
            format,
            meetingContext
        } = req.body;

        const testCases = [];
        let testIdCounter = 1;

        // Generate test cases for each requirement
        requirements.forEach((requirement, reqIndex) => {
            // Generate happy path tests
            if (testTypes.happy) {
                testCases.push(...generateHappyPathTests(requirement, testIdCounter, reqIndex, includeTestData, format));
                testIdCounter += 2;
            }

            // Generate edge case tests
            if (testTypes.edge) {
                testCases.push(...generateEdgeCaseTests(requirement, testIdCounter, reqIndex, includeTestData, format));
                testIdCounter += 2;
            }

            // Generate negative tests
            if (testTypes.negative) {
                testCases.push(...generateNegativeTests(requirement, testIdCounter, reqIndex, includeTestData, format));
                testIdCounter += 2;
            }
        });

        res.status(200).json({
            success: true,
            testCases,
            totalTests: testCases.length,
            format
        });

    } catch (error) {
        console.error('Test generation error:', error);
        res.status(500).json({
            error: 'Failed to generate test cases',
            details: error.message
        });
    }
}

// Generate happy path test cases
function generateHappyPathTests(requirement, startId, reqIndex, includeTestData, format) {
    const tests = [];
    const reqLower = requirement.toLowerCase();
    
    // Analyze requirement for key actions
    const isCreate = reqLower.includes('create') || reqLower.includes('add');
    const isUpdate = reqLower.includes('update') || reqLower.includes('edit') || reqLower.includes('modify');
    const isDelete = reqLower.includes('delete') || reqLower.includes('remove');
    const isView = reqLower.includes('view') || reqLower.includes('display') || reqLower.includes('show');
    const isValidate = reqLower.includes('validate') || reqLower.includes('verify');
    
    const baseTest = {
        id: `TC-${String(startId).padStart(3, '0')}`,
        requirement: requirement,
        type: 'happy',
        description: `Verify successful execution of: ${requirement}`,
        priority: 'High'
    };

    if (format === 'bdd') {
        // BDD format
        baseTest.given = `the user has valid access and required permissions`;
        baseTest.when = `the user performs the action described in the requirement`;
        baseTest.then = `the system should successfully complete the operation`;
        
        if (isCreate) {
            baseTest.when = `the user creates a new item with valid data`;
            baseTest.then = `the item should be created and saved successfully`;
        } else if (isUpdate) {
            baseTest.when = `the user updates existing data with valid changes`;
            baseTest.then = `the changes should be saved and reflected in the system`;
        } else if (isDelete) {
            baseTest.when = `the user deletes an existing item`;
            baseTest.then = `the item should be removed from the system`;
        } else if (isView) {
            baseTest.when = `the user requests to view the information`;
            baseTest.then = `the correct information should be displayed`;
        }
    } else {
        // Standard format
        baseTest.steps = [
            'Navigate to the relevant section of the application',
            'Ensure all prerequisites are met',
            'Perform the action as described in the requirement',
            'Verify the action completes successfully'
        ];
        
        if (isCreate) {
            baseTest.steps = [
                'Navigate to the create/add section',
                'Fill in all required fields with valid data',
                'Submit the form',
                'Verify success message is displayed',
                'Verify the new item appears in the list/system'
            ];
        } else if (isUpdate) {
            baseTest.steps = [
                'Navigate to the item to be updated',
                'Click edit/update button',
                'Modify the required fields with valid data',
                'Save the changes',
                'Verify success message and updated data'
            ];
        } else if (isDelete) {
            baseTest.steps = [
                'Navigate to the item to be deleted',
                'Click delete button',
                'Confirm deletion when prompted',
                'Verify success message',
                'Verify item no longer exists in the system'
            ];
        }
        
        baseTest.expectedResult = 'The operation completes successfully without errors';
    }

    if (includeTestData) {
        baseTest.testData = generateTestData(requirement, 'happy');
    }

    tests.push(baseTest);

    // Add additional happy path test for complex requirements
    if (reqLower.includes('and')) {
        const additionalTest = {
            ...baseTest,
            id: `TC-${String(startId + 1).padStart(3, '0')}`,
            description: `Verify all aspects of: ${requirement}`
        };
        
        if (format === 'bdd') {
            additionalTest.then += ' and all related functionality works correctly';
        } else {
            additionalTest.steps.push('Verify all secondary effects of the operation');
            additionalTest.expectedResult = 'All aspects of the requirement are fulfilled';
        }
        
        tests.push(additionalTest);
    }

    return tests;
}

// Generate edge case test cases
function generateEdgeCaseTests(requirement, startId, reqIndex, includeTestData, format) {
    const tests = [];
    const reqLower = requirement.toLowerCase();
    
    const edgeTest = {
        id: `TC-${String(startId).padStart(3, '0')}`,
        requirement: requirement,
        type: 'edge',
        description: `Verify boundary conditions for: ${requirement}`,
        priority: 'Medium'
    };

    if (format === 'bdd') {
        edgeTest.given = `the system is at a boundary condition`;
        edgeTest.when = `the user performs the action with edge case data`;
        edgeTest.then = `the system should handle it gracefully`;
    } else {
        edgeTest.steps = [
            'Set up boundary condition scenario',
            'Perform action with maximum allowed values',
            'Verify system handles it correctly',
            'Perform action with minimum allowed values',
            'Verify system handles it correctly'
        ];
        edgeTest.expectedResult = 'System handles boundary conditions without errors';
    }

    if (includeTestData) {
        edgeTest.testData = generateTestData(requirement, 'edge');
    }

    tests.push(edgeTest);

    // Special characters test if dealing with text input
    if (reqLower.includes('name') || reqLower.includes('text') || reqLower.includes('description')) {
        const specialCharTest = {
            id: `TC-${String(startId + 1).padStart(3, '0')}`,
            requirement: requirement,
            type: 'edge',
            description: `Verify special character handling for: ${requirement}`,
            priority: 'Medium'
        };

        if (format === 'bdd') {
            specialCharTest.given = `the user has access to input fields`;
            specialCharTest.when = `the user enters special characters (!@#$%^&*)`;
            specialCharTest.then = `the system should accept or reject based on validation rules`;
        } else {
            specialCharTest.steps = [
                'Navigate to the input field',
                'Enter special characters: !@#$%^&*()',
                'Submit the form',
                'Verify appropriate handling'
            ];
            specialCharTest.expectedResult = 'Special characters are handled according to business rules';
        }

        if (includeTestData) {
            specialCharTest.testData = {
                input: '!@#$%^&*()_+-={}[]|\\:";\'<>?,./~`',
                unicode: 'émojis: 😀 🎉 characters: ñ ü ö'
            };
        }

        tests.push(specialCharTest);
    }

    return tests;
}

// Generate negative test cases
function generateNegativeTests(requirement, startId, reqIndex, includeTestData, format) {
    const tests = [];
    const reqLower = requirement.toLowerCase();
    
    const negativeTest = {
        id: `TC-${String(startId).padStart(3, '0')}`,
        requirement: requirement,
        type: 'negative',
        description: `Verify error handling for invalid scenario: ${requirement}`,
        priority: 'Medium'
    };

    if (format === 'bdd') {
        negativeTest.given = `the user attempts an invalid operation`;
        negativeTest.when = `invalid or missing data is provided`;
        negativeTest.then = `the system should display appropriate error message`;
    } else {
        negativeTest.steps = [
            'Navigate to the relevant section',
            'Attempt operation with invalid/missing data',
            'Verify error message is displayed',
            'Verify no unintended changes occur',
            'Verify system remains stable'
        ];
        negativeTest.expectedResult = 'Appropriate error message displayed and system remains stable';
    }

    if (includeTestData) {
        negativeTest.testData = generateTestData(requirement, 'negative');
    }

    tests.push(negativeTest);

    // Permission denied test
    const permissionTest = {
        id: `TC-${String(startId + 1).padStart(3, '0')}`,
        requirement: requirement,
        type: 'negative',
        description: `Verify access control for: ${requirement}`,
        priority: 'High'
    };

    if (format === 'bdd') {
        permissionTest.given = `the user does not have required permissions`;
        permissionTest.when = `the user attempts to perform the action`;
        permissionTest.then = `access should be denied with appropriate message`;
    } else {
        permissionTest.steps = [
            'Log in as user without required permissions',
            'Attempt to perform the restricted action',
            'Verify access denied message',
            'Verify no unauthorized changes occur'
        ];
        permissionTest.expectedResult = 'Access denied with clear error message';
    }

    tests.push(permissionTest);

    return tests;
}

// Generate test data based on requirement and test type
function generateTestData(requirement, testType) {
    const reqLower = requirement.toLowerCase();
    const data = {};

    // Determine data types from requirement
    if (reqLower.includes('email')) {
        data.email = testType === 'happy' ? 'test@example.com' : 
                    testType === 'edge' ? 'a@b.c' : 
                    'invalid-email';
    }

    if (reqLower.includes('password')) {
        data.password = testType === 'happy' ? 'StrongP@ss123' :
                       testType === 'edge' ? 'aaaaaaaa' :
                       '123';
    }

    if (reqLower.includes('phone')) {
        data.phone = testType === 'happy' ? '+1-555-123-4567' :
                    testType === 'edge' ? '1234567890' :
                    'abc123';
    }

    if (reqLower.includes('date')) {
        const today = new Date();
        data.date = testType === 'happy' ? today.toISOString().split('T')[0] :
                   testType === 'edge' ? '1900-01-01' :
                   'invalid-date';
    }

    if (reqLower.includes('amount') || reqLower.includes('price')) {
        data.amount = testType === 'happy' ? '100.00' :
                     testType === 'edge' ? '999999999.99' :
                     '-100';
    }

    if (reqLower.includes('name')) {
        data.name = testType === 'happy' ? 'John Doe' :
                   testType === 'edge' ? 'A' :
                   '';
    }

    if (reqLower.includes('description') || reqLower.includes('comment')) {
        data.description = testType === 'happy' ? 'This is a valid description' :
                          testType === 'edge' ? 'A'.repeat(1000) :
                          '<script>alert("XSS")</script>';
    }

    // Add generic fields if no specific ones found
    if (Object.keys(data).length === 0) {
        data.genericField1 = testType === 'happy' ? 'Valid Value' :
                            testType === 'edge' ? 'Edge Case Value' :
                            null;
        data.genericField2 = testType === 'happy' ? 12345 :
                            testType === 'edge' ? 0 :
                            -1;
    }

    return data;
}