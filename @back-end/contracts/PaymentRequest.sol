// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PaymentRequest
 * @dev Smart contract for creating and managing payment requests on Polygon
 * @notice Merchants can create payment requests and payers can fulfill them via cross-chain transfers
 */
contract PaymentRequest is Ownable, ReentrancyGuard {
    // Payment status enumeration
    enum PaymentStatus {
        Pending,
        Paid,
        Cancelled
    }

    // Payment request data structure
    struct PaymentRequestData {
        address merchant;        // Address of the merchant requesting payment
        address token;           // Token contract address (USDC or USDT on Polygon)
        uint256 amount;          // Amount requested in wei
        uint256 timestamp;       // Timestamp when request was created
        PaymentStatus status;    // Current status of the payment request
        address payer;           // Address of the payer (set when payment is fulfilled)
        uint256 paidAt;          // Timestamp when payment was fulfilled
    }

    // State variables
    uint256 public nextPaymentId;
    mapping(uint256 => PaymentRequestData) public paymentRequests;
    
    // Supported tokens on Polygon mainnet
    address public constant USDC_POLYGON = 0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174; // USDC on Polygon
    address public constant USDT_POLYGON = 0xc2132D05D31c914a87C6611C10748AEb04B58e8F; // USDT on Polygon
    
    // Events
    event PaymentRequestCreated(
        uint256 indexed paymentId,
        address indexed merchant,
        address indexed token,
        uint256 amount,
        uint256 timestamp
    );
    
    event PaymentFulfilled(
        uint256 indexed paymentId,
        address indexed payer,
        uint256 paidAt
    );
    
    event PaymentCancelled(
        uint256 indexed paymentId,
        uint256 cancelledAt
    );

    // Custom errors for better gas efficiency
    error InvalidToken();
    error InvalidAmount();
    error PaymentRequestNotFound();
    error PaymentAlreadyFulfilled();
    error PaymentAlreadyCancelled();
    error UnauthorizedCancellation();

    constructor() Ownable(msg.sender) {
        nextPaymentId = 1; // Start payment IDs from 1
    }

    /**
     * @dev Creates a new payment request
     * @param merchant Address of the merchant requesting payment
     * @param token Address of the token to be paid (must be USDC or USDT)
     * @param amount Amount to be paid in wei
     * @return paymentId The unique ID of the created payment request
     */
    function createPaymentRequest(
        address merchant,
        address token,
        uint256 amount
    ) external returns (uint256 paymentId) {
        // Validate inputs
        if (token != USDC_POLYGON && token != USDT_POLYGON) {
            revert InvalidToken();
        }
        if (amount == 0) {
            revert InvalidAmount();
        }
        if (merchant == address(0)) {
            revert InvalidAmount(); // Reuse error for gas efficiency
        }

        paymentId = nextPaymentId++;
        
        // Store payment request
        paymentRequests[paymentId] = PaymentRequestData({
            merchant: merchant,
            token: token,
            amount: amount,
            timestamp: block.timestamp,
            status: PaymentStatus.Pending,
            payer: address(0),
            paidAt: 0
        });

        emit PaymentRequestCreated(paymentId, merchant, token, amount, block.timestamp);
    }

    /**
     * @dev Retrieves payment request data by ID
     * @param paymentId The ID of the payment request
     * @return requestData The complete payment request data
     */
    function getPaymentRequest(uint256 paymentId) 
        external 
        view 
        returns (PaymentRequestData memory requestData) 
    {
        if (paymentId == 0 || paymentId >= nextPaymentId) {
            revert PaymentRequestNotFound();
        }
        return paymentRequests[paymentId];
    }

    /**
     * @dev Marks a payment request as paid
     * @param paymentId The ID of the payment request
     * @param payer Address of the payer
     * @notice Only the merchant or contract owner can call this function
     */
    function markAsPaid(uint256 paymentId, address payer) 
        external 
        nonReentrant 
    {
        if (paymentId == 0 || paymentId >= nextPaymentId) {
            revert PaymentRequestNotFound();
        }

        PaymentRequestData storage request = paymentRequests[paymentId];
        
        // Check if payment is already fulfilled or cancelled
        if (request.status == PaymentStatus.Paid) {
            revert PaymentAlreadyFulfilled();
        }
        if (request.status == PaymentStatus.Cancelled) {
            revert PaymentAlreadyCancelled();
        }

        // Only merchant or owner can mark as paid
        if (msg.sender != request.merchant && msg.sender != owner()) {
            revert UnauthorizedCancellation(); // Reuse error for gas efficiency
        }

        // Update payment status
        request.status = PaymentStatus.Paid;
        request.payer = payer;
        request.paidAt = block.timestamp;

        emit PaymentFulfilled(paymentId, payer, block.timestamp);
    }

    /**
     * @dev Cancels a payment request
     * @param paymentId The ID of the payment request to cancel
     * @notice Only the merchant can cancel their own payment request
     */
    function cancelPaymentRequest(uint256 paymentId) 
        external 
        nonReentrant 
    {
        if (paymentId == 0 || paymentId >= nextPaymentId) {
            revert PaymentRequestNotFound();
        }

        PaymentRequestData storage request = paymentRequests[paymentId];

        // Check if payment is already fulfilled
        if (request.status == PaymentStatus.Paid) {
            revert PaymentAlreadyFulfilled();
        }

        // Check if payment is already cancelled
        if (request.status == PaymentStatus.Cancelled) {
            revert PaymentAlreadyCancelled();
        }

        // Only merchant can cancel
        if (msg.sender != request.merchant) {
            revert UnauthorizedCancellation();
        }

        // Update status to cancelled
        request.status = PaymentStatus.Cancelled;

        emit PaymentCancelled(paymentId, block.timestamp);
    }

    /**
     * @dev Checks if a payment request exists
     * @param paymentId The ID to check
     * @return exists True if the payment request exists
     */
    function paymentExists(uint256 paymentId) external view returns (bool exists) {
        return paymentId > 0 && paymentId < nextPaymentId;
    }

    /**
     * @dev Gets the current payment ID counter
     * @return currentId The next payment ID that will be assigned
     */
    function getCurrentPaymentId() external view returns (uint256 currentId) {
        return nextPaymentId;
    }

    /**
     * @dev Gets supported token addresses
     * @return usdc USDC token address on Polygon
     * @return usdt USDT token address on Polygon
     */
    function getSupportedTokens() external pure returns (address usdc, address usdt) {
        return (USDC_POLYGON, USDT_POLYGON);
    }
}
