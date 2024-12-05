# Understanding XML Tags

BODY and HEADER are two main tags
`<DESC>` - Description for Request/Response
`<DATA>` - Data required for Request/Response

Summmarize from - https://help.tallysolutions.com/article/DeveloperReference/integration-capabilities/significance_of_tags.htm

---

# Push Data to Tally:

- Tally can import data objects either in the form of a Master or Voucher.

## Request:

### Format:

- `<HEADER>` contains:
  - `<TALLYREQUEST>` must contain value Import
  - `<TYPE>` must contain value Data
  - `<ID>` should contain the Import TDL Report i.e., either All Masters or Vouchers.
- `<DESC>` can contain report settings like Company Name, behavior of Import in case of duplicates found
  - as desired which should be enclosed within `<STATICVARIABLES>` Tag.
- `<DATA>` must contain the XML Data Fragment within Tag `<TALLYMESSAGE>` that needs to be imported

### Example:

```
<ENVELOPE>
    <HEADER>
        <VERSION>1</VERSION>
        <TALLYREQUEST>Import</TALLYREQUEST>
        <TYPE>Data</TYPE>
        <ID>All Masters</ID
    </HEADER>

    <BODY>
        <DESC>
            <STATICVARIABLES>
                <IMPORTDUPS>@@DUPCOMBINE</IMPORTDUPS>
            </STATICVARIABLES>
        </DESC>

        <DATA>
            <TALLYMESSAGE>
                <LEDGER NAME="ICICI" Action = "Create">
                    <NAME>ICICI</NAME>
                    <PARENT>Bank Accounts</PARENT>
                    <OPENINGBALANCE>-12500</OPENINGBALANCE>
                </LEDGER>

                <GROUP NAME=" Bangalore Debtors" Action = "Create">
                    <NAME>Bangalore Debtors</NAME>
                    <PARENT>Sundry Debtors</PARENT>
                </GROUP>

                <LEDGER NAME="RK Builders Pvt Ltd" Action = "Create">
                    <NAME>RK Builders Pvt Ltd</NAME>
                    <PARENT>Bangalore Debtors</PARENT>
                    <OPENINGBALANCE>-1000</OPENINGBALANCE>
                </LEDGER>
            </TALLYMESSAGE>
        </DATA>
    </BODY>
</ENVELOPE>
```

In the above XML Request, Create action is used. Any of the following system formulae can be used to choose the required behaviour in case the system encounters a ledger with the same name. The behavior is for the treatment of the Opening Balance which is being imported. DupModify specifies that the current Opening Balance should be modified with the new one that is being imported.

DupIgnoreCombine specifies that the ledger if exists need to be ignored. DupCombine specifies the system to combine both the Opening Balances. Ideally, this option is used when Data pertaining to Group Companies are merged together into a single company. On processing the above request for importing ledgers, the requested ledgers are created in Tally and the following response is received:

## Voucher Example:

### Request:

```
<ENVELOPE>
	<HEADER>
		<VERSION>1</VERSION>
		<TALLYREQUEST>Import</TALLYREQUEST>
		<TYPE>Data</TYPE>
		<ID>Vouchers</ID>
	</HEADER>
	<BODY>
		<DESC></DESC>
		<DATA>
			<TALLYMESSAGE>
				<VOUCHER>
					<DATE>20080402</DATE>
					<NARRATION>Ch. No. Tested</NARRATION>
					<VOUCHERTYPENAME>Payment</VOUCHERTYPENAME>
					<VOUCHERNUMBER>1</VOUCHERNUMBER>
					<ALLLEDGERENTRIES.LIST>
						<LEDGERNAME>Conveyance</LEDGERNAME>
						<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
						<AMOUNT>-12000.00</AMOUNT>
					</ALLLEDGERENTRIES.LIST>
					<ALLLEDGERENTRIES.LIST>
						<LEDGERNAME>Bank of India</LEDGERNAME>
						<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
						<AMOUNT>12000.00</AMOUNT>
					</ALLLEDGERENTRIES.LIST>
				</VOUCHER>
				<VOUCHER>
					<DATE>20080402</DATE>
					<NARRATION>Ch. No. : Tested</NARRATION>
					<VOUCHERTYPENAME>Payment</VOUCHERTYPENAME>
					<VOUCHERNUMBER>2</VOUCHERNUMBER>
					<ALLLEDGERENTRIES.LIST>
						<LEDGERNAME>Conveyance</LEDGERNAME>
						<ISDEEMEDPOSITIVE>Yes</ISDEEMEDPOSITIVE>
						<AMOUNT>-5000.00</AMOUNT>
					</ALLLEDGERENTRIES.LIST>
					<ALLLEDGERENTRIES.LIST>
						<LEDGERNAME>Bank of India</LEDGERNAME>
						<ISDEEMEDPOSITIVE>No</ISDEEMEDPOSITIVE>
						<AMOUNT>5000.00</AMOUNT>
					</ALLLEDGERENTRIES.LIST>
				</VOUCHER>
			</TALLYMESSAGE>
		</DATA>
	</BODY>
</ENVELOPE>
```

### Response:

```
<ENVELOPE>
	<HEADER>
		<VERSION>1</VERSION>
		<STATUS>1</STATUS>
	</HEADER>
	<BODY>
		<DATA>
			<IMPORTRESULT>
				<CREATED>2</CREATED>
				<ALTERED>0</ALTERED>
				<LASTVCHID>119</LASTVCHID>
				<LASTMID>0</LASTMID>
				<COMBINED>0</COMBINED>
				<IGNORED>0</IGNORED>
				<ERRORS>0</ERRORS>
			</IMPORTRESULT>
		</DATA>
	</BODY>
</ENVELOPE>
```
