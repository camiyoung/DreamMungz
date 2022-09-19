pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "./SSFToken.sol";
import "./MFT.sol";
import "./MFTSale.sol";
import "./MFTNego.sol";

/**
* MFT 거래정보를 관리하는 컨트랙트
* 
* @author 황승주
* @since 2022. 09. 16.
*/

contract MFTSaleFactory is Ownable {
    using Counters for Counters.Counter;

    // Sale ID(1씩 자동 증가)
    Counters.Counter private _saleIds;
    // Nego ID(1씩 자동 증가)
    Counters.Counter private _negoIds;
    // Sale 컨트랙트 주소
    mapping(uint256 => address) private _saleAddrs;
    // Nego 컨트랙트 주소
    mapping(uint256 => address) private _negoAddrs;
    // MFT 판매자
    mapping(uint256 => address) private _saleSellers;
    // MFT 구매자
    mapping(uint256 => address) private _saleBuyers;
    // 해당 지갑 주소가 판매자였던 Sale ID 목록
    mapping(address => uint256[]) private _sellSaleIdsByWallet;
    // 해당 지갑 주소가 구매자였던 Sale ID 목록
    mapping(address => uint256[]) private _buySaleIdsByWallet;
    // 해당 지갑 주소의 모든 Sale ID 목록
    mapping(address => uint256[]) private _saleIdsByWallet;
    // 해당 MFT ID의 모든 Sale ID 목록
    mapping(uint256 => uint256[]) private _saleIdsOfMFT;
    // 해당 지갑 주소의 모든 Nego ID 목록
    mapping(uint256 => uint256[]) private _negoIdsByWallet;
    // 해당 Sale ID의 모든 Nego ID 목록
    mapping(uint256 => uint256[]) private _negoIdsOfSale;

    // SSAFY 토큰(SSF) 활용을 위한 ERC-20 토큰 컨트랙트 주소
    address private SSFToken(_SSFTokenContractAddress)Address;
    // MFT 활용을 위한 ERC-721 토큰 컨트랙트 주소
    address private _MFTContractAddress;

    /**
    * constructor
    * Sale 컨트랙트를 관리하는 SaleFactory 생성
    * 
    * @ param address SSFTokenContractAddress SSAFY 토큰(ERC-20) 컨트랙트 주소
    * @ param address MFTContractAddress MFT(ERC-721) 컨트랙트 주소
    * @ return None
    * @ exception None
    */
    constructor(
        address SSFTokenContractAddress,
        address MFTConractAddress) {
        SSFToken(_SSFTokenContractAddress)Address = SSFTokenContractAddress;
        _MFTContractAddress = MFTConractAddress;
    }

    /**
    * createSale
    * 새로운 Sale 컨트랙트를 생성하고 관리할 정보들을 갱신
    * 
    * @ param uint256 MFTId MFT ID
    * @ param address seller 판매자
    * @ param uint256 buyNowPrice 즉시 구매 금액
    * @ param uint256 startedAt 판매 시작 시간
    * @ param bool negoAble 제안 가능 여부 
    * @ return None
    * @ exception 즉시 구매 금액은 0 이상이어야 함
    * @ exception MFT가 판매자의 소유여야 함    
    */
    function createSale(
        uint256 MFTId,
        address seller,
        uint256 buyNowPrice, 
        uint256 startedAt, 
        bool negoAble
        ) public {
        require(buyNowPrice >= 0, "Price must be higher than 0.");
        require(MFT(_MFTContractAddress).ownerOf(MFTId) == seller, "Seller is not owner.");

        // 새로운 Sale의 ID 결정
        _saleIds.increment();
        uint256 newMFTSaleId = _saleIds.current();
        
        // 새로운 Sale 컨트랙트 생성
        MFTSale newMFTSale = new MFTSale(MFTId, seller, buyNowPrice, startedAt, negoAble, SSFToken(_SSFTokenContractAddress)Address, _MFTContractAddress);

        // 새로운 Sale 컨트랙트가 거래 대상인 MFT에 대한 접근 권한을 획득
        MFT(_MFTContractAddress).approve(address(newMFTSale), MFTId);

        // Sale 관리 정보 갱신
        _saleAddrs[newMFTSaleId] = address(newMFTSale);
        _saleSellers[newMFTSaleId] = seller;
        _sellSaleIdsByWallet[seller].push(newMFTSaleId);
        _saleIdsByWallet[seller].push(newMFTSaleId);
        _saleIdsOfMFT[MFTId].push(newMFTSaleId);

        // Sale이 생성되었다는 event emit 필요
    }
    
    /**
    * createNego
    * 새로운 Nego 컨트랙트를 생성하고 관리할 정보들을 갱신
    * 
    * @ param uint256 saleId 제안한 Sale ID
    * @ param address negoer 제안자 지갑 주소
    * @ param uint256 negoPrice 제안 금액
    * @ param uint256 negoAt 제안 일시
    * @ param bool isChoiced 제안 채택 여부
    * @ param bool isCanceled 제안 취소 여부
    * @ return None
    * @ exception 제안 금액은 0 이상이어야 함
    * @ exception 제안 하는 Sale은 진행중이어야 함
    * @ exception 제안 하는 Sale은 제안 가능 여부가 true이어야 함
    * @ exception 제안 하는 지갑은 제안 금액 이상의 잔고를 보유해야함
    */
    function createNego(
        uint256 saleId,
        address negoer,
        uint256 negoPrice,
        uint256 negoAt,
        bool isChoiced,
        bool isCanceled
    ) public {
        require(buyNowPrice >= 0, "Price must be higher than 0.");
        require(!Sale(_saleAddrs[saleId]).isEnded, "This sale is already ended.");
        require(Sale(_saleAddrs[saleId]).getNegoAble, "This sale prohibits a negotiation.")
        require(SSFToken(_SSFTokenContractAddress).balanceOf(negoer) >= negoPrice, "Negoer's balance is exhausted.");

        // 새로운 Nego의 ID 결정
        _negoIds.increment();
        uint256 newMFTNegoId = _negoIds.current();

        // 새로운 Nego 컨트랙트 생성
        MFTNego newMFTNego = new MFTNego(_saleAddr[saleId], negoer, negoPrice, negoAt, isChoiced, isCanceled);

        // Nego 관리정보 갱신
        _negoAddrs[newNFTNegoId] = address(newNFTNego);
        _negoIdsByWallet[negoer].push(newNFTNegoId);
        _negoIdsOfSale[negoer].push(newNFTNegoId);

        // Sale 컨트랙트 내 Nego 관리 함수 호출
        MFTSale(_saleAddrs[saleId]).reportNego(address(newNFTNegoId, newNFTNego, negoer, negoPrice, negoAt, isChoiced, isCanceled));

        // Nego가 생성되었다는 event emit 필요
    }

    /**
    * cancelSale
    * 해당 Sale을 취소하는 함수를 호출한다.
    * 
    * @ param uint256 saleId 취소할 Sale ID
    * @ return None
    * @ exception 취소할 Sale이 진행중이어야 함
    * @ exception 취소할 Sale이 취소상태가 아니어야 함
    */
    function cancelSale(
        uint256 saleId
    ) public {
        MFTSale canceledSale = MFTSale(_saleAddrs[saleId]);
        require(!canceledSale.getIsEnded(), "This sale is already ended.");
        require(!canceledSale.getIsCanceled(), "This sale is already canceled.");

        canceledSale.cancel();

        // Sale이 취소되었다는 event emit 필요
    }

    /**
    * cancelNego
    * 해당 Nego를 취소하는 MFTSale의 함수를 호출한다.
    * 
    * @ param uint256 negoId 취소할 Nego ID
    * @ return None
    * @ exception 취소할 Nego가 속한 Sale이 진행중이어야 함
    * @ exception 취소할 Nego가 취소상태가 아니어야 함
    */
    function cancelNego(
        uint256 negoId
    ) public {
        // 취소할 Nego와 해당 Sale
        MFTNego canceledNego = MFTNego(_negoAddrs(negoId));
        MFTSale includeSale = MFTSale(canceledNego.getSaleAddr());

        require(!includeSale.getIsEnded(), "This sale is already ended.");
        require(!canceledNego.getIsCanceled(), "This negotiation is already canceled.");

        // Sale 컨트랙트의 취소 함수 호출
        includeSale.cancelNego(negoId);

        // Nego가 취소되었다는 event emit 필요
    }

    /**
    * buyNow
    * Sale의 즉시 구매 금액으로 구매하는 함수를 호출한다.
    * 구매자 관련 정보를 갱신한다.
    * 
    * @ param uint256 saleId Sale ID
    * @ param address buyer 구매자 지갑 주소
    * @ return None
    * @ exception 거래가 종료상태가 아니어야 함
    * @ exception 판매자가 MFT의 소유자여야 함
    * @ exception 구매자가 즉시 구매 금액 이상의 금액을 가지고 있어야 함
    */
    function buyNow(
        uint256 saleId,
        address buyer
    ) public {
        MFTSale finishedSale = MFTSale(_saleAddrs[saleId]);
        require(!finishedSale.getIsEnded(), "This sale is already ended.");
        require(MFT(_MFTContractAddress).ownerOf(finishedSale.getMFTId()) == finishedSale.getSeller());
        require(SSFToken(_SSFTokenContractAddress).balanceOf(buyer) >= finishedSale.getBuyNowPrice(), "Buyer's balance is exhausted.");

        // 해당 Sale의 즉시 구매 함수를 호출
        finishedSale.buyNow(buyer);

        // 구매자 관련 정보를 갱신
        reportBuyer(buyer);

        // 구매가 완료되었다는 event emit 필요
    }

    /**
    * acceptNego
    * 해당 Sale의 Nego를 수락하는 함수를 호출한다.
    * 구매자 관련 정보를 갱신한다.
    * 
    * @ param uint256 saleId 채택된 Nego가 포함된 Sale ID
    * @ param uint256 negoId 채택된 Nego ID
    * @ return None
    * @ exception 거래가 종료상태가 아니어야 함
    * @ exception 판매자가 MFT의 소유자여야 함
    * @ exception 채택된 Nego가 취소상태가 아니어야 함
    * @ exception 채택된 Nego가 채택된 상태가 아니어야 함
    */
    function acceptNego(
        uint256 saleId,
        uint256 negoId
    ) public {
        MFTSale finishedSale = MFTSale(_saleAddrs[saleId]);
        require(!finishedSale.getIsEnded(), "This sale is already ended.");
        require(MFT(_MFTContractAddress).ownerOf(finishedSale.getMFTId()) == finishedSale.getSeller());
    
        MFTNego choicedNego = MFTNego(_negoAddrs[negoId]);
        require(!choicedNego.getIsCanceled(), "This negotiation is canceled.");
        require(!choicedNego.getIsChoiced(), "This negotiation is already choiced.");

        // Nego를 수락하는 함수 호출
        finishedSale.acceptNego(negoId);

        // 구매자 관련 정보를 갱신
        reportBuyer(choicedNego.getNegoer());

        // 구매가 완료되었다는 event emit 필요
    }

    /** 
    * reportBuyer
    * Sale 종료 후 구매자 정보 기록
    * 
    * @ param uint256 endedMFTSaleId 종료된 Sale Id
    * @ param address saleBuyer 구매자
    * @ return None
    * @ exception None
    */
    function reportBuyer(address saleBuyer) private {
        _saleBuyers[endedMFTSaleId] = saleBuyer;
        _buySaleIdsByWallet[saleBuyer].push(endedMFTSaleId);
        _saleIds[saleBuyer].push(endedMFTSaleId);
    }

    /**
    * getSale
    * Sale의 Contract 주소를 반환
    *
    * @ param uint256 saleId 거래 ID
    * @ return address 거래 Contract address
    * @ exception None
    */
    function getSale(uint256 saleId) public view returns(address) {
        return _saleAddrs[saleId];
    }

    /**
    * getSeller
    * Sale의 판매자를 반환
    *
    * @ param uint256 saleId 거래 ID
    * @ return address 판매자 지갑 주소
    * @ exception None
    */
    function getSeller(uint256 saleId) public view returns(address) {
        return _saleSellers[saleId];
    }

    /**
    * getBuyer
    * Sale의 구매자를 반환
    *
    * @ param uint256 saleId 거래 ID
    * @ return address 구매자 지갑 주소
    * @ exception Sale이 진행 중이거나 판매 취소를 하였을 경우는 존재하지 않음
    */
    function getBuyer(uint256 saleId) public view returns(address) {
        require(_saleBuyers[saleId] != 0, "This sale is proceeding or canceled.");

        return _saleBuyers[saleId];
    }

    /**
    * getSellIdsByWallet
    * 해당 지갑 주소의 모든 판매 SaleId 목록 반환
    *
    * @ param address seller 판매자 지갑 주소
    * @ return uint256 Sale Id 목록
    * @ exception None
    */
    function getSellIdsByWallet(address seller) public view returns(uint256[] memory) {
        return _saleIdsByWallet[seller];
    }

    /**
    * getBuyIdsByWallet
    * 해당 지갑 주소의 모든 구매 SaleId 목록 반환
    *
    * @ param address buyer 구매자 지갑 주소
    * @ return uint256 Sale Id 목록
    * @ exception None
    */
    function getBuyIdsByWallet(address buyer) public view returns(uint256[] memory) {
        return _buyIdsByWallet[buyer];
    }

    /**
    * getSaleIdsByWallet
    * 해당 지갑 주소의 모든 SaleId 목록 반환
    *
    * @ param address walletAddr 지갑 주소
    * @ return uint256 Sale Id 목록
    * @ exception None
    */
    function getSaleIdsByWallet(address walletAddr) public view returns(uint256[] memory) {
        return _saleIdsByWallet[walletAddr];
    }

    /**
    * getSaleIdsOfMFT
    * 해당 MFT의 모든 SaleId 목록 반환
    *
    * @ param uint256 MFTId MFT ID
    * @ return uint256[] Sale Id 목록
    * @ exception None
    */
    function getSaleIdsOfMFT(uint256 MFTId) public view returns(uint256[] memory) {
        return _saleIdsOfMFT[MFTId];
    }
}