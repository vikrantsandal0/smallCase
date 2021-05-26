
create table trades(
	id bigserial NOT NULL, 
	security_uuid UUID NOT NULL, 
	trade_price DECIMAL(10, 2) NOT NULL, 
	trade_type varchar(45) NOT NULL,   
	trade_quantity int  NOT NULL,         
	new_average_price  DECIMAL(10, 2) NOT NULL,
	new_quantity int  NOT NULL,    
    old_quantity int NOT NULL,
    old_average DECIMAL(10, 2) NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE   ,       
	created_on timestamp NOT NULL,
    modified_on timestamp NOT NULL,
    CONSTRAINT trade_portfolio_sec_uuid FOREIGN KEY (security_uuid) REFERENCES portfolio(uuid)
NOT DEFERRABLE 
INITIALLY IMMEDIATE;
);

-- Adding foreign key constraint with expertise uuid
ALTER TABLE expertise_events ADD CONSTRAINT expertise_events_expertises_src_expertise_id
FOREIGN KEY (src_expertise_id) REFERENCES expertises(uuid)
NOT DEFERRABLE 
INITIALLY IMMEDIATE;


-------
CREATE TABLE IF NOT EXISTS portfolio (
id bigserial,
uuid uuid NOT NULL DEFAULT uuid_generate_v4(),
"ticker_symbol" varchar(45) NOT NULL,
average_price DECIMAL(10, 2) NOT NULL,
current_quantity int  NOT NULL,
old_quantity int  NOT NULL,
old_average DECIMAL(10, 2) NOT NULL,
created_on timestamp NOT NULL DEFAULT timezone('utc'::text, now()),
modified_on timestamp NOT NULL DEFAULT timezone('utc'::text, now()),
CONSTRAINT portfolio_pk PRIMARY KEY (id),
CONSTRAINT portfolio_ck_modified_on CHECK ((modified_on >= created_on)),
CONSTRAINT portfolio_uuid_key UNIQUE (uuid)
);
alter table portfolio add column is_deleted boolean default false
