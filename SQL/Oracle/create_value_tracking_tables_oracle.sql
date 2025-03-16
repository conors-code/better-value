--Create the tables for the value generation system
/*
create an oracle table called KEY_VALUE_INDICATORS with the following columns:
- INDICATOR_ID: NUMBER, primary key
- INDICATOR_NAME: VARCHAR2(255), not null
- DATE_INDICATOR_ADDED: DATE, not null
- DATE_INDICATOR_REMOVED: DATE, nullable

create an oracle table called KEY_VALUE_INDICATOR_LEAD with the following columns:
- INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- LEAD_FOR_INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- LAG_FOR_INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- DATE_ADDED_AS_LEAD: DATE, not null
- DATE_REMOVED_AS_LEAD: DATE, nullable

create an oracle table called KEY_VALUE_INDICATOR_LAG with the following columns:
- INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- LEAD_FOR_INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- LAG_FOR_INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- DATE_ADDED_AS_LAG: DATE, not null
- DATE_REMOVED_AS_LAG: DATE, nullable

create an oracle table called KEY_VALUE_INDICATOR_TARGET_VALUES with the following columns:
- INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- TARGET_VALUE: VARCHAR2(255), not null
- DATE_TARGET_VALUE_START: DATE, not null
- DATE_TARGET_VALUE_END: DATE, nullable
- THRESHOLD_VALUE_FOR_RAG: VARCHAR2(255), not null

--Can have multiple indicators at the same priority level, e.g. n of m high priority,
--the rest not.
create an oracle table called KEY_VALUE_INDICATOR_PRIORITY with the following columns:
- INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- PRIORITY: NUMBER, not null   -- 1 is highest priority, 2 is next highest, etc.
- DATE_PRIORITY_START: DATE, not null
- DATE_PRIORITY_END: DATE, nullable

--Allow initiatives to be grouped into a program
create an oracle table called VALUE_GENERATING_PROGRAMS with the following columns:
- PROGRAM_ID: NUMBER, primary key
- PROGRAM_NAME: VARCHAR2(255), not null
- PROGRAM_OWNER: VARCHAR2(255), not null
- DATE_PROGRAM_ADDED: DATE, nullable
- DATE_PROGRAM_REMOVED: DATE, nullable

create an oracle table called VALUE_GENERATING_INITIATIVES with the following columns:
- INITIATIVE_ID: NUMBER, primary key
- INITIATIVE_NAME: VARCHAR2(255), not null
- INITIATIVE_OWNER: VARCHAR2(255), not null
- DATE_INITIATIVE_ADDED: DATE, nullable
- DATE_INITIATIVE_REMOVED: DATE, nullable
- PROGRAM_ID: NUMBER, foreign key to VALUE_GENERATING_PROGRAMS.PROGRAM_ID

--Allow initiatives to be linked to indicators
--Now for tracking the actual values for each initiative
create an oracle table called KEY_VALUE_INDICATOR_ACTUALS with the following columns:
- INDICATOR_ID: NUMBER, foreign key to KEY_VALUE_INDICATORS.INDICATOR_ID
- INITIATIVE_ID: NUMBER, foreign key to VALUE_GENERATING_INITIATIVES.INITIATIVE_ID
- ACTUAL_VALUE: VARCHAR2(255), not null
- DATE_VALUE_INSERTED : DATE, not null
- ACTUAL_VALUE_SOURCE: VARCHAR2(255), not null, default 'promised' --for promise, default to 'promised'
*/

create table KEY_VALUE_INDICATORS (
    INDICATOR_ID NUMBER primary key,
    INDICATOR_NAME VARCHAR2(255) not null,
    DATE_INDICATOR_ADDED DATE not null,
    DATE_INDICATOR_REMOVED DATE
);
create table KEY_VALUE_INDICATOR_LEAD (
    INDICATOR_ID NUMBER,
    LEAD_FOR_INDICATOR_ID NUMBER,
    DATE_ADDED_AS_LEAD DATE not null,
    DATE_REMOVED_AS_LEAD DATE,
    constraint FK_INDICATOR_ID foreign key (INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID),
    constraint FK_LEAD_FOR_INDICATOR_ID foreign key (LEAD_FOR_INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID)
);
create table KEY_VALUE_INDICATOR_LAG (
    INDICATOR_ID NUMBER,
    LAG_FOR_INDICATOR_ID NUMBER,
    DATE_ADDED_AS_LAG DATE not null,
    DATE_REMOVED_AS_LAG DATE,
    constraint FK_INDICATOR_ID foreign key (INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID),
    constraint FK_LAG_FOR_INDICATOR_ID foreign key (LAG_FOR_INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID)
);
create table KEY_VALUE_INDICATOR_TARGET_VALUES (
    INDICATOR_ID NUMBER,
    TARGET_VALUE VARCHAR2(255) not null,
    DATE_TARGET_VALUE_START DATE not null,
    DATE_TARGET_VALUE_END DATE,
    THRESHOLD_VALUE_FOR_RAG VARCHAR2(255) not null,
    constraint FK_INDICATOR_ID foreign key (INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID)
);
create table KEY_VALUE_INDICATOR_PRIORITY (
    INDICATOR_ID NUMBER,
    INDICATOR_PRIORITY NUMBER not null,
    DATE_PRIORITY_START DATE not null,
    DATE_PRIORITY_END DATE,
    constraint FK_INDICATOR_ID foreign key (INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID)
);
create table VALUE_GENERATING_PROGRAMS (
    PROGRAM_ID NUMBER primary key,
    PROGRAM_NAME VARCHAR2(255) not null,
    PROGRAM_OWNER VARCHAR2(255) not null,
    DATE_PROGRAM_ADDED DATE,
    DATE_PROGRAM_REMOVED DATE
);
create table VALUE_GENERATING_INITIATIVES (
    INITIATIVE_ID NUMBER primary key,
    INITIATIVE_NAME VARCHAR2(255) not null,
    INITIATIVE_OWNER VARCHAR2(255) not null,
    DATE_INITIATIVE_ADDED DATE,
    DATE_INITIATIVE_REMOVED DATE,
    PROGRAM_ID NUMBER,
    constraint FK_PROGRAM_ID foreign key (PROGRAM_ID) references VALUE_GENERATING_PROGRAMS (PROGRAM_ID)
);
create table KEY_VALUE_INDICATOR_ACTUALS (
    INDICATOR_ID NUMBER,
    INITIATIVE_ID NUMBER,
    ACTUAL_VALUE VARCHAR2(255) not null,
    IS_PROMISED_VALUE NUMBER(1) not null default 0, -- 0 = false, 1 = true. Default to measured unless in future
    DATE_VALUE_EFFECTIVE DATE not null,
    ACTUAL_VALUE_SOURCE VARCHAR2(255) not null default 'promised',
    constraint FK_INDICATOR_ID foreign key (INDICATOR_ID) references KEY_VALUE_INDICATORS (INDICATOR_ID),
    constraint FK_INITIATIVE_ID foreign key (INITIATIVE_ID) references VALUE_GENERATING_INITIATIVES (INITIATIVE_ID)
);
